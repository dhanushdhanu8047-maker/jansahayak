// server/security.mjs - Security, sanitization, and rate limiting for JanSahayak AI

/**
 * Basic rate limiter tracking requests per IP per minute
 */
const rateLimitMap = new Map();
const CLEANUP_INTERVAL = 60 * 1000;

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.resetTime > 60000) {
      rateLimitMap.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);
cleanupTimer.unref();

export function checkRateLimit(ip, limit = 30) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now };
  if (now - record.resetTime > 60000) {
    record.count = 1;
    record.resetTime = now;
    rateLimitMap.set(ip, record);
    return { allowed: true, remaining: limit - 1 };
  }

  record.count += 1;
  rateLimitMap.set(ip, record);

  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((record.resetTime + 60000 - now) / 1000),
    };
  }

  return { allowed: true, remaining: limit - record.count };
}

/**
 * Sanitize plain user text inputs
 */
export function sanitizeText(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  let clean = input.trim().slice(0, maxLength);
  // Remove null bytes
  clean = clean.replace(/\0/g, '');
  // Disarm dangerous html tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/javascript:/gi, '');
  clean = clean.replace(/onload=/gi, '');
  clean = clean.replace(/onerror=/gi, '');
  return clean;
}

/**
 * Sanitize untrusted webpage scraped content before feeding into reasoning engines.
 * Guard against prompt injection attacks embedded in scraped HTML or web text.
 */
export function sanitizeUntrustedWebContent(content, maxLength = 25000) {
  if (!content) return '';
  let text = typeof content === 'string' ? content : JSON.stringify(content);
  text = text.slice(0, maxLength);

  // Strip HTML tags
  text = text.replace(/<[^>]*>/g, ' ');

  // Guard against prompt injection payloads commonly found in web scraping targets
  const promptInjectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /disregard\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /system\s+prompt\s+override/gi,
    /you\s+are\s+now\s+in\s+developer\s+mode/gi,
    /now\s+act\s+as\s+DAN/gi,
    /jailbreak/gi,
    /format\s+your\s+response\s+as\s+a\s+JSON\s+with\s+fake/gi,
  ];

  for (const pattern of promptInjectionPatterns) {
    text = text.replace(pattern, '[filtered untrusted pattern]');
  }

  // Normalize excessive whitespaces
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * Standard Security Headers Middleware
 */
export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com data: blob:;"
  );
}
