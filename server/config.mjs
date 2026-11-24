// server/config.mjs - Central configuration loader for JanSahayak AI
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Simple zero-dependency .env loader
export function loadEnv() {
  const envPath = path.join(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        // Remove surrounding quotes if any
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// Load env on initialization
loadEnv();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  tinyfish: {
    apiKey: (process.env.TINYFISH_API_KEY || '').trim(),
    baseUrl: (process.env.TINYFISH_BASE_URL || 'https://agent.tinyfish.ai').replace(/\/+$/, ''),
    timeoutMs: parseInt(process.env.TINYFISH_TIMEOUT_MS || '300000', 10),
    maxRetries: 2,
  },
  claude: {
    apiKey: (process.env.ANTHROPIC_API_KEY || '').trim(),
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  },
  cache: {
    ttlMinutes: parseInt(process.env.CACHE_TTL_MINUTES || '60', 10),
  },
  rateLimit: {
    maxPerMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '30', 10),
  },
  paths: {
    root: projectRoot,
    public: path.join(projectRoot, 'public'),
    data: path.join(projectRoot, 'data'),
  }
};

/**
 * Update environment variable at runtime and persist into .env
 */
export function updateRuntimeKey(key, value) {
  process.env[key] = value;
  if (key === 'TINYFISH_API_KEY') config.tinyfish.apiKey = value.trim();
  if (key === 'ANTHROPIC_API_KEY') config.claude.apiKey = value.trim();

  // Try saving to .env file
  try {
    const envPath = path.join(projectRoot, '.env');
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
    fs.writeFileSync(envPath, content, 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to persist key to .env:', err.message);
    return false;
  }
}

/**
 * Returns safe public diagnostics without exposing secret credentials
 */
export function getSafeConfigStatus() {
  return {
    tinyfishConfigured: Boolean(config.tinyfish.apiKey && config.tinyfish.apiKey.length > 5),
    tinyfishKeyMasked: config.tinyfish.apiKey ? `${config.tinyfish.apiKey.slice(0, 4)}...${config.tinyfish.apiKey.slice(-4)}` : null,
    tinyfishBaseUrl: config.tinyfish.baseUrl,
    claudeConfigured: Boolean(config.claude.apiKey && config.claude.apiKey.length > 5),
    claudeKeyMasked: config.claude.apiKey ? `${config.claude.apiKey.slice(0, 4)}...${config.claude.apiKey.slice(-4)}` : null,
    environment: config.nodeEnv,
    port: config.port,
    cacheTtlMinutes: config.cache.ttlMinutes,
  };
}
