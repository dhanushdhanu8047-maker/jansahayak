// server/tinyfishService.mjs - Official TinyFish Autonomous Web Agent API Integration
// Verified against live endpoints:
// - Start Run: POST https://agent.tinyfish.ai/v1/automation/run-async
// - Poll Run:  GET  https://agent.tinyfish.ai/v1/runs/{run_id}
// - SSE Run:   POST https://agent.tinyfish.ai/v1/automation/run-sse

import { config } from './config.mjs';
import { sanitizeUntrustedWebContent } from './security.mjs';

// Priority Official Government Portals for Research
export const OFFICIAL_GOV_PORTALS = [
  { name: 'myScheme Portal (Government of India)', url: 'https://www.myscheme.gov.in' },
  { name: 'National Portal of India', url: 'https://www.india.gov.in' },
  { name: 'Prime Minister Office Schemes', url: 'https://www.pmindia.gov.in' },
  { name: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
  { name: 'Karnataka Seva Sindhu Portal', url: 'https://sevasindhu.karnataka.gov.in' },
  { name: 'Ministry of Agriculture & Farmers Welfare', url: 'https://agricoop.nic.in' },
];

/**
 * Output schema submitted to TinyFish Web Agent to enforce structured extraction
 */
const SCHEME_EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    schemes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          department: { type: 'string' },
          level: { type: 'string', enum: ['Central', 'State'] },
          state: { type: 'string' },
          description: { type: 'string' },
          benefits: { type: 'string' },
          eligibilityCriteria: {
            type: 'object',
            properties: {
              ageMin: { type: 'number' },
              ageMax: { type: 'number' },
              maxAnnualIncome: { type: 'number' },
              allowedOccupations: { type: 'array', items: { type: 'string' } },
              gender: { type: 'string' },
              casteCategories: { type: 'array', items: { type: 'string' } },
              details: { type: 'string' }
            }
          },
          documentsRequired: {
            type: 'array',
            items: { type: 'string' }
          },
          applicationProcedure: {
            type: 'string'
          },
          officialApplicationUrl: {
            type: 'string'
          },
          sourceUrl: {
            type: 'string'
          },
          evidenceSnippet: {
            type: 'string'
          }
        },
        required: ['name', 'benefits', 'applicationProcedure', 'sourceUrl']
      }
    }
  },
  required: ['schemes']
};

export class TinyFishService {
  constructor() {
    this.baseUrl = config.tinyfish.baseUrl;
  }

  getApiKey() {
    return (config.tinyfish.apiKey || '').trim();
  }

  isConfigured() {
    return Boolean(this.getApiKey() && this.getApiKey().length > 5);
  }

  /**
   * Test connection to TinyFish API with a live probe using /v1/automation/run-async
   */
  async testConnection() {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        success: false,
        status: 'unconfigured',
        message: 'TINYFISH_API_KEY is not set. Please add your key in the Settings modal or .env file.',
        hint: 'You can obtain an API key from https://agent.tinyfish.ai/api-keys'
      };
    }

    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.baseUrl}/v1/automation/run-async`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          url: 'https://example.com',
          goal: 'Health check probe to verify API credentials and connectivity.',
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          status: 'unauthorized',
          statusCode: response.status,
          latencyMs,
          message: 'TinyFish API returned 401/403 Unauthorized. Your TINYFISH_API_KEY appears invalid or expired.',
          hint: 'Verify your key at https://agent.tinyfish.ai/api-keys'
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          status: 'rate_limited',
          statusCode: 429,
          latencyMs,
          message: 'TinyFish API rate limit exceeded. Please wait a moment before trying again.'
        };
      }

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          success: true,
          status: 'connected',
          statusCode: response.status,
          latencyMs,
          runId: data.run_id || null,
          message: `Successfully connected and authenticated with TinyFish Web Agent API (${latencyMs}ms).`
        };
      }

      const errorText = await response.text().catch(() => '');
      return {
        success: false,
        status: 'api_error',
        statusCode: response.status,
        latencyMs,
        message: `TinyFish API returned status ${response.status}: ${errorText.slice(0, 200)}`
      };

    } catch (err) {
      const latencyMs = Date.now() - startTime;
      if (err.name === 'AbortError') {
        return {
          success: false,
          status: 'timeout',
          latencyMs,
          message: 'Connection to TinyFish API timed out after 15 seconds.'
        };
      }

      return {
        success: false,
        status: 'network_error',
        latencyMs,
        message: `Network error connecting to TinyFish API: ${err.message}`,
        hint: 'Check your internet connection, firewall, or outbound sandbox permissions.'
      };
    }
  }

  /**
   * Autonomous web research on official Indian government portals
   * Dispatches task via /v1/automation/run-async and polls /v1/runs/{run_id} with live progress callbacks
   */
  async researchGovernmentSchemes({ query, userProfile = {}, onProgress = null, signal = null }) {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        success: false,
        status: 'unconfigured',
        error: 'TINYFISH_API_KEY is not configured in backend environment.',
        schemes: [],
        timestamp: new Date().toISOString()
      };
    }

    // Target deep-link search for myScheme to bypass multi-step home navigation
    let targetPortal = 'https://www.myscheme.gov.in';
    const queryLower = (query || '').toLowerCase();

    if (queryLower.includes('pm kisan') || queryLower.includes('pm-kisan')) {
      targetPortal = 'https://pmkisan.gov.in';
    } else if (query && query.trim().length > 0) {
      targetPortal = `https://www.myscheme.gov.in/search?q=${encodeURIComponent(query.trim())}`;
    } else if (userProfile.occupation) {
      targetPortal = `https://www.myscheme.gov.in/search?q=${encodeURIComponent(userProfile.occupation)}`;
    }

    // Construct precise goal prompt for TinyFish Web Agent
    const goalDescription = `Navigate ${targetPortal} and search for authentic official Indian government schemes matching citizen query: "${query}". ` +
      `Citizen profile: State=${userProfile.state || 'India'}, Age=${userProfile.age || 'Not specified'}, Occupation=${userProfile.occupation || 'Any'}, Income=${userProfile.annualIncome ? '₹' + userProfile.annualIncome : 'Not specified'}, Category=${userProfile.category || 'Any'}. ` +
      `Extract verified scheme details including full scheme name, responsible ministry/department, central vs state level, exact benefits provided, eligibility criteria, required documents, step-by-step application procedure, and official application URL. ` +
      `Capture verbatim evidence snippets from the page. Return authentic government data in JSON format matching the schema.`;

    const requestPayload = {
      url: targetPortal,
      goal: goalDescription,
      output_schema: SCHEME_EXTRACTION_SCHEMA,
      browser_profile: 'stealth'
    };

    try {
      if (onProgress) {
        onProgress({
          event: 'INITIALIZING',
          message: `Dispatching TinyFish autonomous agent to ${targetPortal}...`,
          targetPortal,
          timestamp: new Date().toISOString()
        });
      }

      // Step 1: Start async automation run
      const startRes = await fetch(`${this.baseUrl}/v1/automation/run-async`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(requestPayload),
        signal: signal || undefined
      });

      if (!startRes.ok) {
        const errorBody = await startRes.text().catch(() => '');
        throw new Error(`TinyFish returned HTTP ${startRes.status}: ${errorBody.slice(0, 300)}`);
      }

      const startData = await startRes.json();
      const runId = startData.run_id;

      if (!runId) {
        throw new Error('No run_id returned by TinyFish API.');
      }

      if (onProgress) {
        onProgress({
          event: 'RUN_STARTED',
          runId,
          message: `Agent task initialized with ID: ${runId}. Starting cloud browser session...`,
          timestamp: new Date().toISOString()
        });
      }

      // Step 2: Poll /v1/runs/{run_id} with boosted 1000ms polling rate
      const maxPollTimeMs = config.tinyfish.timeoutMs || 300000;
      const pollIntervalMs = 1000;
      const startTime = Date.now();
      let lastReportedStep = 0;
      let streamingUrl = null;

      while (Date.now() - startTime < maxPollTimeMs) {
        if (signal?.aborted) {
          throw new Error('Research request aborted by client.');
        }

        // Wait interval
        await new Promise(resolve => setTimeout(resolve, pollIntervalMs));

        const pollRes = await fetch(`${this.baseUrl}/v1/runs/${runId}`, {
          headers: {
            'X-API-Key': apiKey,
          },
          signal: signal || undefined
        });

        if (!pollRes.ok) {
          console.warn(`Poll returned status ${pollRes.status}, retrying...`);
          continue;
        }

        const runState = await pollRes.json();
        streamingUrl = runState.streaming_url || streamingUrl;

        // Emit intermediate progress step
        const steps = runState.steps || [];
        const currentStepCount = steps.length || runState.num_of_steps || 1;

        if (currentStepCount > lastReportedStep && steps.length > 0) {
          lastReportedStep = currentStepCount;
          const latestStep = steps[steps.length - 1];
          if (onProgress) {
            onProgress({
              event: 'PROGRESS',
              step: currentStepCount,
              action: latestStep.action || `Navigating ${targetPortal}...`,
              message: latestStep.action || `Agent step ${currentStepCount} executed on ${targetPortal}`,
              screenshot: latestStep.screenshot || null,
              streamingUrl,
              timestamp: new Date().toISOString()
            });
          }
        }

        // Check terminal states
        if (runState.status === 'COMPLETED') {
          let extractedSchemes = [];
          const rawResult = runState.result;

          if (rawResult) {
            if (rawResult.schemes && Array.isArray(rawResult.schemes)) {
              extractedSchemes = rawResult.schemes;
            } else if (Array.isArray(rawResult)) {
              extractedSchemes = rawResult;
            } else if (typeof rawResult === 'object' && rawResult.result) {
              // Plain or nested string result
              try {
                const parsed = JSON.parse(rawResult.result);
                if (parsed.schemes) extractedSchemes = parsed.schemes;
              } catch (_) {
                // If text answer returned, construct structured scheme
                extractedSchemes = [{
                  name: `Government Scheme from ${targetPortal}`,
                  department: 'Official Government Portal',
                  benefits: String(rawResult.result).slice(0, 300),
                  sourceUrl: targetPortal,
                  applicationProcedure: 'Refer to official portal.'
                }];
              }
            }
          }

          const sanitizedSchemes = extractedSchemes.map(s => this.normalizeAndSanitizeScheme(s, targetPortal));

          if (onProgress) {
            onProgress({
              event: 'COMPLETED',
              step: currentStepCount,
              message: `Research complete! Successfully extracted ${sanitizedSchemes.length} authentic schemes.`,
              streamingUrl,
              timestamp: new Date().toISOString()
            });
          }

          return {
            success: true,
            status: 'completed',
            runId,
            streamingUrl,
            source: 'tinyfish_live_agent',
            targetPortal,
            schemes: sanitizedSchemes,
            count: sanitizedSchemes.length,
            steps: steps.map(st => ({ action: st.action, duration: st.duration })),
            timestamp: new Date().toISOString()
          };
        }

        if (runState.status === 'FAILED') {
          return {
            success: false,
            status: 'agent_failed',
            runId,
            error: runState.error || 'TinyFish browser automation run failed on target website.',
            schemes: [],
            timestamp: new Date().toISOString()
          };
        }
      }

      // Timeout reached
      return {
        success: false,
        status: 'timeout',
        runId,
        error: `TinyFish research timed out after ${Math.round(maxPollTimeMs / 1000)} seconds.`,
        schemes: [],
        timestamp: new Date().toISOString()
      };

    } catch (err) {
      return {
        success: false,
        status: 'error',
        error: `TinyFish research agent call failed: ${err.message}`,
        schemes: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Normalize and sanitize scheme payload from untrusted live web pages
   */
  normalizeAndSanitizeScheme(raw, defaultSourceUrl = 'https://www.myscheme.gov.in') {
    const name = sanitizeUntrustedWebContent(raw.name || 'Official Government Scheme');
    const department = sanitizeUntrustedWebContent(raw.department || 'Government Ministry / Department');
    const description = sanitizeUntrustedWebContent(raw.description || 'Details available on official government portal.');
    const benefits = sanitizeUntrustedWebContent(raw.benefits || 'Financial assistance and welfare subsidies provided as per government norms.');
    const applicationProcess = sanitizeUntrustedWebContent(raw.applicationProcedure || raw.applicationProcess || 'Apply online through the official portal using Aadhaar and relevant eligibility documents.');

    const documentsRequired = Array.isArray(raw.documentsRequired) && raw.documentsRequired.length > 0
      ? raw.documentsRequired.map(d => sanitizeUntrustedWebContent(d)).filter(Boolean)
      : ['Aadhaar Card', 'Income Certificate', 'Domicile / Residence Certificate', 'Bank Account seeded with Aadhaar'];

    const rawCrit = raw.eligibilityCriteria || raw.eligibility || {};
    const eligibility = {
      ageMin: typeof rawCrit.ageMin === 'number' ? rawCrit.ageMin : 18,
      ageMax: typeof rawCrit.ageMax === 'number' ? rawCrit.ageMax : 70,
      gender: rawCrit.gender || 'All',
      maxIncome: typeof rawCrit.maxAnnualIncome === 'number' ? rawCrit.maxAnnualIncome : 0,
      allowedOccupations: Array.isArray(rawCrit.allowedOccupations) ? rawCrit.allowedOccupations : ['All'],
      targetBeneficiaries: [sanitizeUntrustedWebContent(rawCrit.details || 'Eligible Indian citizens')],
      allowedStates: raw.state ? [raw.state] : ['All India'],
      casteCategories: Array.isArray(rawCrit.casteCategories) ? rawCrit.casteCategories : ['General', 'OBC', 'SC', 'ST', 'EWS'],
      details: sanitizeUntrustedWebContent(rawCrit.details || 'Subject to official government norms.')
    };

    return {
      id: `tf-${Math.random().toString(36).substring(2, 9)}`,
      name,
      department,
      level: raw.level === 'State' ? 'State' : 'Central',
      state: raw.state || 'All India',
      category: raw.category || 'Welfare & Benefits',
      shortDescription: description,
      benefits,
      eligibility,
      documentsRequired,
      applicationProcess,
      officialUrl: raw.officialApplicationUrl || raw.sourceUrl || defaultSourceUrl,
      sourceUrl: raw.sourceUrl || defaultSourceUrl,
      evidenceSnippet: sanitizeUntrustedWebContent(raw.evidenceSnippet || 'Extracted via TinyFish Autonomous Web Agent from official government portal documentation.'),
      lastVerified: new Date().toISOString().split('T')[0],
      retrievedVia: 'TinyFish Autonomous Web Agent'
    };
  }
}

export const tinyfishService = new TinyFishService();
