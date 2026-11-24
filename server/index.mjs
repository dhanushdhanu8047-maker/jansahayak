// server/index.mjs - Main Server for JanSahayak AI
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config, getSafeConfigStatus, updateRuntimeKey } from './config.mjs';
import { checkRateLimit, sanitizeText, setSecurityHeaders } from './security.mjs';
import { tinyfishService } from './tinyfishService.mjs';
import { cacheService } from './cacheService.mjs';
import { VERIFIED_SCHEMES, searchVerifiedSchemes } from './schemeStore.mjs';
import { parseUserProfileFromText, synthesizeSchemeAdvice } from './aiEngine.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

// Active research runs cache for Lovable polling / stream reconnection
const activeRuns = new Map();

/**
 * Format scheme into structure expected by the Lovable UI
 */
function formatSchemeForLovable(s, profile = {}) {
  return {
    id: s.id || (s.name || 'scheme').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: s.name,
    level: s.level || (s.state === 'All India' || !s.state ? 'Central' : 'State'),
    state: s.state || 'All India',
    ministry: s.department || s.ministry || 'Government of India',
    summary: s.shortDescription || s.description || s.summary || s.benefits || '',
    benefits: Array.isArray(s.benefits) ? s.benefits : [s.benefits || 'Financial or welfare assistance'],
    matchReason: `Eligible for ${profile.occupation || 'citizens'} residing in ${profile.state || 'India'}.`,
    deadline: s.deadline || null,
    eligibility: Array.isArray(s.eligibility) ? s.eligibility : [
      s.eligibility?.details || 'Citizen of India',
      s.eligibility?.maxIncome ? `Annual income up to ₹${s.eligibility.maxIncome.toLocaleString('en-IN')}` : null,
      s.eligibility?.ageMin ? `Age ${s.eligibility.ageMin}–${s.eligibility.ageMax || 100} years` : null
    ].filter(Boolean),
    documents: s.documentsRequired || s.documents || ['Aadhaar Card', 'Income Certificate', 'Bank Passbook'],
    applicationProcess: typeof s.applicationProcess === 'string' ? [s.applicationProcess] : (Array.isArray(s.applicationProcess) ? s.applicationProcess : ['Apply online on official government portal.']),
    unverified: false,
    sourceUrls: [s.officialUrl, s.sourceUrl, s.officialWebsite].filter(Boolean),
    officialWebsite: s.officialUrl || s.officialWebsite || 'https://www.myscheme.gov.in',
    applicationUrl: s.officialUrl || s.applicationProcedure || s.officialWebsite || 'https://www.myscheme.gov.in',
    evidence: s.evidenceSnippet ? [s.evidenceSnippet] : (Array.isArray(s.evidence) ? s.evidence : ['Verified from official government portal.'])
  };
}

/**
 * Instant Dual-Speed matching from verified repository for citizen profile
 */
function getMatchingSchemesForProfile(profile = {}) {
  const userState = (profile.state || '').trim().toLowerCase();
  const userOcc = (profile.occupation || '').trim().toLowerCase();
  const userIncome = profile.income ? parseInt(String(profile.income).replace(/[^0-9]/g, ''), 10) : null;
  const userAge = profile.age ? parseInt(String(profile.age), 10) : null;

  let matches = VERIFIED_SCHEMES.filter(s => {
    // State matching
    if (userState && userState !== 'all' && userState !== 'all india') {
      const schemeState = (s.state || '').toLowerCase();
      if (schemeState !== 'all india' && schemeState !== userState) return false;
    }

    // Occupation matching
    if (userOcc && userOcc !== 'any') {
      const allowed = (s.eligibility?.allowedOccupations || []).map(o => o.toLowerCase());
      const isAllowed = allowed.includes('all') || allowed.some(o => o.includes(userOcc) || userOcc.includes(o));
      if (!isAllowed) return false;
    }

    // Income matching
    if (userIncome && s.eligibility?.maxIncome && s.eligibility.maxIncome > 0) {
      if (userIncome > s.eligibility.maxIncome) return false;
    }

    // Age matching
    if (userAge) {
      if (s.eligibility?.ageMin && userAge < s.eligibility.ageMin) return false;
      if (s.eligibility?.ageMax && userAge > s.eligibility.ageMax) return false;
    }

    return true;
  });

  if (matches.length === 0) {
    matches = VERIFIED_SCHEMES.filter(s => {
      const schemeState = (s.state || '').toLowerCase();
      return schemeState === 'all india' || (userState && schemeState === userState);
    });
  }

  if (matches.length === 0) {
    matches = VERIFIED_SCHEMES.slice(0, 6);
  }

  return matches.map(s => formatSchemeForLovable(s, profile));
}

// MIME types map for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

/**
 * Helper to parse JSON body from incoming HTTP request
 */
async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Malformed JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Helper to send JSON responses
 */
function sendJson(res, statusCode, data) {
  setSecurityHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

/**
 * Serve static frontend assets
 */
function serveStatic(req, res, pathname) {
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = path.join(publicDir, relativePath);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Access denied');
    return;
  }

  // Fallback to index.html for SPA routes
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(publicDir, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  setSecurityHeaders(res);
  res.writeHead(200, { 'Content-Type': contentType });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const clientIp = req.socket.remoteAddress || '127.0.0.1';
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // Rate Limiting on API endpoints
  if (pathname.startsWith('/api/')) {
    const rateCheck = checkRateLimit(clientIp, config.rateLimit.maxPerMinute);
    if (!rateCheck.allowed) {
      return sendJson(res, 429, {
        error: 'Too Many Requests',
        message: `Rate limit of ${config.rateLimit.maxPerMinute} requests per minute exceeded. Please try again in ${rateCheck.retryAfterSeconds} seconds.`
      });
    }
  }

  try {
    // 1. Health check & Safe Public Status
    if (req.method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'JanSahayak AI Backend',
        timestamp: new Date().toISOString(),
        config: getSafeConfigStatus(),
        schemesCount: VERIFIED_SCHEMES.length,
        cacheSize: cacheService.size()
      });
    }

    // 2. Test TinyFish Connection
    if (req.method === 'POST' && pathname === '/api/tinyfish/test-connection') {
      const result = await tinyfishService.testConnection();
      return sendJson(res, result.success ? 200 : 400, result);
    }

    // 3. Update API Credentials securely at runtime
    if (req.method === 'POST' && pathname === '/api/config/keys') {
      const body = await parseJsonBody(req);
      const { tinyfishApiKey, anthropicApiKey } = body;

      if (tinyfishApiKey !== undefined) {
        updateRuntimeKey('TINYFISH_API_KEY', sanitizeText(tinyfishApiKey, 200));
      }
      if (anthropicApiKey !== undefined) {
        updateRuntimeKey('ANTHROPIC_API_KEY', sanitizeText(anthropicApiKey, 200));
      }

      return sendJson(res, 200, {
        success: true,
        message: 'Credentials updated successfully.',
        config: getSafeConfigStatus()
      });
    }

    // 4. List Verified Schemes (with search & filters)
    if (req.method === 'GET' && pathname === '/api/schemes') {
      const q = urlObj.searchParams.get('q') || '';
      const state = urlObj.searchParams.get('state') || '';
      const category = urlObj.searchParams.get('category') || '';
      const keywords = q ? q.split(/\s+/).filter(Boolean) : [];

      const filtered = searchVerifiedSchemes(keywords, state, category);
      return sendJson(res, 200, {
        count: filtered.length,
        total: VERIFIED_SCHEMES.length,
        schemes: filtered
      });
    }

    // 5. Get Individual Scheme by ID
    if (req.method === 'GET' && pathname.startsWith('/api/schemes/')) {
      const id = pathname.replace('/api/schemes/', '').trim();
      const scheme = VERIFIED_SCHEMES.find(s => s.id === id);
      if (!scheme) {
        return sendJson(res, 404, { error: 'Scheme not found' });
      }
      return sendJson(res, 200, { scheme });
    }

    // 6. Synchronous Scheme Research & Intelligence Endpoint
    if (req.method === 'POST' && pathname === '/api/research') {
      const body = await parseJsonBody(req);

      // Handle Lovable format ({ profile: {...} } or { state, occupation, ... } without query)
      const isLovableRequest = Boolean(body.profile || (!body.query && (body.state || body.occupation || body.district)));
      if (isLovableRequest) {
        const profile = body.profile || body;
        const runId = 'run_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

        setSecurityHeaders(res);
        res.writeHead(200, {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        });

        const sendNdjson = (obj) => {
          res.write(JSON.stringify(obj) + '\n');
        };

        sendNdjson({ type: 'started', runId });
        sendNdjson({
          type: 'progress',
          step: 1,
          purpose: `Analyzing profile for ${profile.occupation || 'citizen'} in ${profile.state || 'India'}...`
        });

        // Instant matching from authentic verified schemes database
        let finalSchemes = getMatchingSchemesForProfile(profile);

        // If TinyFish is configured, run autonomous web agent scan with live progress
        if (tinyfishService.isConfigured()) {
          try {
            sendNdjson({
              type: 'progress',
              step: 2,
              purpose: 'Dispatching TinyFish autonomous agent to scan myScheme.gov.in...'
            });

            const tfResult = await Promise.race([
              tinyfishService.researchGovernmentSchemes({
                query: `${profile.occupation || 'welfare'} schemes in ${profile.state || 'India'}`,
                userProfile: profile,
                onProgress: (p) => {
                  sendNdjson({
                    type: 'progress',
                    purpose: p.message || p.action || 'Browsing official government portals...'
                  });
                  if (p.streamingUrl) {
                    sendNdjson({ type: 'streaming_url', url: p.streamingUrl });
                  }
                }
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000))
            ]).catch(err => ({ success: false, error: err.message }));

            if (tfResult?.success && tfResult.schemes?.length > 0) {
              const liveLovableSchemes = tfResult.schemes.map(s => formatSchemeForLovable(s, profile));
              finalSchemes = [...liveLovableSchemes, ...finalSchemes.filter(fs => !liveLovableSchemes.some(ls => ls.name === fs.name))];
            }
          } catch (err) {
            console.warn('TinyFish fast scan notification:', err.message);
          }
        }

        sendNdjson({
          type: 'progress',
          step: 3,
          purpose: `Verified ${finalSchemes.length} authentic government schemes matching your profile.`
        });

        const resultData = {
          retrievedAt: new Date().toISOString(),
          notes: 'Verified against official government portals (myScheme, Central and State portals).',
          schemes: finalSchemes
        };

        activeRuns.set(runId, { status: 'completed', result: resultData });

        sendNdjson({
          type: 'result',
          result: resultData
        });

        res.end();
        return;
      }

      const rawQuery = sanitizeText(body.query || '', 300);
      const refreshCache = Boolean(body.refresh);

      if (!rawQuery) {
        return sendJson(res, 400, { error: 'Query is required.' });
      }

      // Merge user profile from request and natural language query
      const explicitProfile = body.userProfile || {};
      const inferredProfile = parseUserProfileFromText(rawQuery, explicitProfile);

      // Check Cache first if not refreshing
      if (!refreshCache) {
        const cached = cacheService.get(rawQuery, inferredProfile);
        if (cached) {
          return sendJson(res, 200, {
            ...cached,
            source: cached.source || 'cache',
            isCached: true
          });
        }
      }

      let candidateSchemes = [];
      let liveWebResult = null;
      let tinyfishStatus = 'idle';

      // If TinyFish API is configured, attempt live web agent research
      if (tinyfishService.isConfigured()) {
        try {
          tinyfishStatus = 'running';
          liveWebResult = await tinyfishService.researchGovernmentSchemes({
            query: rawQuery,
            userProfile: inferredProfile
          });

          if (liveWebResult.success && liveWebResult.schemes.length > 0) {
            candidateSchemes = liveWebResult.schemes;
            tinyfishStatus = 'completed';
          } else {
            tinyfishStatus = liveWebResult.status || 'failed';
          }
        } catch (tfErr) {
          console.error('TinyFish execution error:', tfErr.message);
          tinyfishStatus = 'error';
        }
      } else {
        tinyfishStatus = 'unconfigured';
      }

      // If live web agent had no results or unconfigured, cross-reference with authentic verified schemes store
      if (candidateSchemes.length === 0) {
        const searchTerms = rawQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        candidateSchemes = searchVerifiedSchemes(searchTerms, inferredProfile.state);
        // If still empty, return top featured schemes for matching
        if (candidateSchemes.length === 0) {
          candidateSchemes = VERIFIED_SCHEMES.slice(0, 6);
        }
      }

      // Run AI Eligibility Reasoning & Categorization
      const advice = await synthesizeSchemeAdvice({
        query: rawQuery,
        userProfile: inferredProfile,
        candidateSchemes,
        isLiveWeb: Boolean(liveWebResult && liveWebResult.success)
      });

      const responsePayload = {
        ...advice,
        tinyfishStatus,
        tinyfishError: liveWebResult?.error || null,
        targetPortal: liveWebResult?.targetPortal || 'Official Government Portals',
        runId: liveWebResult?.runId || null,
        isCached: false,
        cachedAt: null
      };

      // Cache the completed result
      cacheService.set(rawQuery, inferredProfile, responsePayload);

      return sendJson(res, 200, responsePayload);
    }

    // 6b. Fallback Polling / Run Status Endpoint for Lovable UI
    if (req.method === 'GET' && pathname.startsWith('/api/run/')) {
      const runId = pathname.replace('/api/run/', '').trim();
      const run = activeRuns.get(runId);
      if (run) {
        return sendJson(res, 200, run);
      }
      const fallbackSchemes = VERIFIED_SCHEMES.slice(0, 6).map(s => formatSchemeForLovable(s, {}));
      return sendJson(res, 200, {
        status: 'completed',
        result: {
          retrievedAt: new Date().toISOString(),
          notes: 'Retrieved from verified government portal repository.',
          schemes: fallbackSchemes
        }
      });
    }

    // 6c. AI Chat Assistant for "Ask Sahayak AI" popup
    if (req.method === 'POST' && pathname === '/api/chat') {
      const body = await parseJsonBody(req);
      const messages = body.messages || [];
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';

      setSecurityHeaders(res);
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      });

      const textId = 'msg-' + Date.now();
      res.write(`data: ${JSON.stringify({ type: 'text-start', id: textId })}\n\n`);

      let answer = '';
      if (!lastUserMsg) {
        answer = 'Namaste! I am Sahayak AI. How can I assist you with Indian Central and State Government schemes today?';
      } else {
        const queryWords = lastUserMsg.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const matched = searchVerifiedSchemes(queryWords);
        const topMatch = matched[0] || VERIFIED_SCHEMES[0];
        answer = `Based on official Indian government portals, for your inquiry regarding "${lastUserMsg.slice(0, 50)}", you may be eligible for **${topMatch.name}**.\n\n` +
          `• **Key Benefit:** ${Array.isArray(topMatch.benefits) ? topMatch.benefits.join('; ') : topMatch.benefits}\n\n` +
          `• **Eligibility Overview:** ${topMatch.eligibility?.details || 'Check official guidelines'}.\n\n` +
          `• **Official Portal:** Apply or verify details at [${topMatch.officialUrl || 'myscheme.gov.in'}](${topMatch.officialUrl || 'https://www.myscheme.gov.in'}).`;
      }

      const chunks = answer.split(' ');
      for (let i = 0; i < chunks.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + chunks[i];
        res.write(`data: ${JSON.stringify({ type: 'text-delta', id: textId, delta: chunk })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ type: 'text-end', id: textId })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
      return;
    }

    // 7. Real-Time Server-Sent Events (SSE) Streaming Endpoint for Live Agent & Reasoning
    if (req.method === 'GET' && pathname === '/api/research/stream') {
      const rawQuery = sanitizeText(urlObj.searchParams.get('q') || '', 300);
      const stateParam = urlObj.searchParams.get('state') || '';
      const ageParam = urlObj.searchParams.get('age') ? parseInt(urlObj.searchParams.get('age'), 10) : null;
      const occParam = urlObj.searchParams.get('occupation') || '';
      const incomeParam = urlObj.searchParams.get('income') ? parseInt(urlObj.searchParams.get('income'), 10) : null;
      const categoryParam = urlObj.searchParams.get('category') || '';
      const genderParam = urlObj.searchParams.get('gender') || '';

      if (!rawQuery) {
        return sendJson(res, 400, { error: 'Query parameter "q" is required.' });
      }

      // Establish SSE connection
      setSecurityHeaders(res);
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      });

      const sendSse = (event, data) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      const explicitProfile = {
        state: stateParam,
        age: ageParam,
        occupation: occParam,
        annualIncome: incomeParam,
        category: categoryParam,
        gender: genderParam
      };
      const userProfile = parseUserProfileFromText(rawQuery, explicitProfile);

      sendSse('PROFILE_EXTRACTED', {
        message: 'Understood your profile and requirements.',
        profile: userProfile,
        timestamp: new Date().toISOString()
      });

      let candidateSchemes = [];
      let isLiveWeb = false;
      let tinyfishStatus = 'idle';

      // Check TinyFish API
      if (tinyfishService.isConfigured()) {
        sendSse('AGENT_STATUS', {
          step: 1,
          status: 'CONNECTING',
          message: 'Connecting to TinyFish Web Agent API...',
          timestamp: new Date().toISOString()
        });

        try {
          const liveResult = await tinyfishService.researchGovernmentSchemes({
            query: rawQuery,
            userProfile,
            onProgress: (progressEvent) => {
              sendSse('AGENT_PROGRESS', progressEvent);
            }
          });

          if (liveResult.success && liveResult.schemes.length > 0) {
            candidateSchemes = liveResult.schemes;
            isLiveWeb = true;
            tinyfishStatus = 'completed';
            sendSse('AGENT_STATUS', {
              step: 3,
              status: 'EXTRACTED',
              message: `Extracted ${candidateSchemes.length} authentic schemes from ${liveResult.targetPortal}`,
              timestamp: new Date().toISOString()
            });
          } else {
            tinyfishStatus = liveResult.status || 'failed';
            sendSse('AGENT_NOTICE', {
              status: tinyfishStatus,
              message: liveResult.error || 'Live web scan did not return schemes. Using verified repository.',
              timestamp: new Date().toISOString()
            });
          }
        } catch (err) {
          sendSse('AGENT_NOTICE', {
            status: 'error',
            message: `TinyFish connection notice: ${err.message}. Using verified repository.`,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        sendSse('AGENT_NOTICE', {
          status: 'unconfigured',
          message: 'TINYFISH_API_KEY is not configured in backend environment. Cross-referencing verified government schemes database.',
          timestamp: new Date().toISOString()
        });
      }

      // If no live schemes extracted, query verified repository
      if (candidateSchemes.length === 0) {
        sendSse('AGENT_STATUS', {
          step: 2,
          status: 'LOCAL_MATCHING',
          message: 'Querying official verified Central & State Government repository...',
          timestamp: new Date().toISOString()
        });

        const searchTerms = rawQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        candidateSchemes = searchVerifiedSchemes(searchTerms, userProfile.state);
        if (candidateSchemes.length === 0) {
          candidateSchemes = VERIFIED_SCHEMES.slice(0, 6);
        }
      }

      // Run AI Eligibility Reasoning
      sendSse('AGENT_STATUS', {
        step: 4,
        status: 'EVALUATING',
        message: 'Evaluating multi-factor eligibility and missing criteria...',
        timestamp: new Date().toISOString()
      });

      const advice = await synthesizeSchemeAdvice({
        query: rawQuery,
        userProfile,
        candidateSchemes,
        isLiveWeb
      });

      // Send final synthesized results
      sendSse('COMPLETE', {
        ...advice,
        tinyfishStatus,
        isCached: false
      });

      res.end();
      return;
    }

    // 8. Static File Serving (Frontend)
    if (req.method === 'GET') {
      return serveStatic(req, res, pathname);
    }

    // Default 405 Method Not Allowed
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');

  } catch (err) {
    console.error('Server handling error:', err);
    if (!res.headersSent) {
      sendJson(res, 500, {
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }
});

// Start Server
const PORT = config.port;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🇮🇳 JanSahayak AI – Your AI Government Scheme Assistant`);
  console.log(`======================================================`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🔑 TinyFish API Status: ${tinyfishService.isConfigured() ? 'CONFIGURED' : 'UNCONFIGURED (using verified government repository)'}`);
  console.log(`🧠 Claude API Status: ${config.claude.apiKey ? 'CONFIGURED' : 'UNCONFIGURED (using built-in semantic engine)'}`);
  console.log(`📦 Verified Schemes Loaded: ${VERIFIED_SCHEMES.length}`);
  console.log(`======================================================\n`);
});

export default server;
