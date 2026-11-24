// server/cacheService.mjs - Smart caching with timestamps and invalidation
import crypto from 'node:crypto';
import { config } from './config.mjs';

export class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttlMs = config.cache.ttlMinutes * 60 * 1000;
  }

  generateKey(query, userProfile = {}) {
    const normalizedQuery = (query || '').toLowerCase().trim();
    const normalizedProfile = {
      state: (userProfile.state || '').toLowerCase().trim(),
      age: userProfile.age || '',
      occupation: (userProfile.occupation || '').toLowerCase().trim(),
      income: userProfile.annualIncome || '',
      category: (userProfile.category || '').toLowerCase().trim(),
      gender: (userProfile.gender || '').toLowerCase().trim(),
    };
    const raw = `${normalizedQuery}::${JSON.stringify(normalizedProfile)}`;
    return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 16);
  }

  get(query, userProfile = {}) {
    const key = this.generateKey(query, userProfile);
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    item.hits += 1;
    return {
      ...item.data,
      isCached: true,
      cachedAt: item.cachedAt,
      cacheHits: item.hits,
      expiresInSeconds: Math.round((item.expiresAt - now) / 1000)
    };
  }

  set(query, userProfile = {}, data, customTtlMs = null) {
    const key = this.generateKey(query, userProfile);
    const now = Date.now();
    const expiresAt = now + (customTtlMs || this.ttlMs);

    this.cache.set(key, {
      data,
      cachedAt: new Date().toISOString(),
      expiresAt,
      hits: 0,
    });
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const cacheService = new CacheService();
