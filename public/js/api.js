// public/js/api.js - Frontend API Client for JanSahayak AI

export class ApiClient {
  constructor() {
    this.baseUrl = '';
  }

  async getHealthStatus() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  }

  async testTinyFishConnection() {
    const res = await fetch('/api/tinyfish/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  }

  async updateConfigKeys(keys = {}) {
    const res = await fetch('/api/config/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys)
    });
    return await res.json();
  }

  async fetchSchemes(params = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set('q', params.q);
    if (params.state) qs.set('state', params.state);
    if (params.category) qs.set('category', params.category);

    const res = await fetch(`/api/schemes?${qs.toString()}`);
    return await res.json();
  }

  async fetchSchemeById(id) {
    const res = await fetch(`/api/schemes/${encodeURIComponent(id)}`);
    return await res.json();
  }

  async submitResearchSync({ query, userProfile = {}, refresh = false }) {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, userProfile, refresh })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.message || err.error || 'Server error');
    }
    return await res.json();
  }

  /**
   * SSE Streaming Research with real-time browser agent progress
   */
  streamResearch({ query, userProfile = {}, onEvent, onComplete, onError }) {
    const qs = new URLSearchParams({
      q: query,
      state: userProfile.state || '',
      age: userProfile.age || '',
      occupation: userProfile.occupation || '',
      income: userProfile.annualIncome || '',
      category: userProfile.category || '',
      gender: userProfile.gender || ''
    });

    const eventSource = new EventSource(`/api/research/stream?${qs.toString()}`);

    eventSource.addEventListener('PROFILE_EXTRACTED', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onEvent) onEvent('PROFILE_EXTRACTED', data);
      } catch (err) {}
    });

    eventSource.addEventListener('AGENT_STATUS', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onEvent) onEvent('AGENT_STATUS', data);
      } catch (err) {}
    });

    eventSource.addEventListener('AGENT_PROGRESS', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onEvent) onEvent('AGENT_PROGRESS', data);
      } catch (err) {}
    });

    eventSource.addEventListener('AGENT_NOTICE', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onEvent) onEvent('AGENT_NOTICE', data);
      } catch (err) {}
    });

    eventSource.addEventListener('COMPLETE', (e) => {
      try {
        const data = JSON.parse(e.data);
        eventSource.close();
        if (onComplete) onComplete(data);
      } catch (err) {
        eventSource.close();
        if (onError) onError(err);
      }
    });

    eventSource.onerror = (err) => {
      eventSource.close();
      if (onError) onError(new Error('Connection interrupted or timed out.'));
    };

    return () => eventSource.close(); // Abort handle
  }
}

export const api = new ApiClient();
