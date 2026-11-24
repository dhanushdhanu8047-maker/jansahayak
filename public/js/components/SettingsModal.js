// public/js/components/SettingsModal.js - Secure API Configuration & Live Connection Tester
import { api } from '../api.js';

export function renderSettingsModal(container, healthStatus, onClose, onUpdated) {
  const tfConfigured = healthStatus?.config?.tinyfishConfigured;
  const claudeConfigured = healthStatus?.config?.claudeConfigured;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-slate-900/95 text-white rounded-3xl max-w-lg w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 overflow-hidden flex flex-col relative backdrop-blur-2xl">
        
        <!-- Header -->
        <div class="bg-[#030712] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-base">
              🔑
            </div>
            <div>
              <h3 class="font-bold text-sm text-white">API & Agent Settings</h3>
              <p class="text-[11px] text-slate-400 font-mono">Server-Side Credentials Isolation</p>
            </div>
          </div>
          <!-- Close Button (preserves exact ID #btn-close-settings) -->
          <button id="btn-close-settings" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm border border-white/10">
            ✕
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 sm:p-7 space-y-6 text-xs text-slate-300">
          
          <!-- TinyFish Section -->
          <div class="p-5 rounded-2xl border transition-all ${tfConfigured ? 'bg-emerald-500/[0.06] border-emerald-500/30' : 'bg-white/[0.03] border-white/10'}">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-white text-xs flex items-center gap-2">
                <span>🤖</span>
                <span>TinyFish Web Agent API (Primary)</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${tfConfigured ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}">
                ${tfConfigured ? 'Active & Configured' : 'Unconfigured'}
              </span>
            </div>
            
            <p class="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Powers autonomous navigation and authentic data extraction across official Indian government websites. Keys are strictly kept server-side.
            </p>

            <div class="space-y-2.5">
              <label class="font-bold text-[11px] text-slate-300 block font-mono">TINYFISH_API_KEY</label>
              <div class="flex gap-2">
                <input 
                  type="password" 
                  id="input-tinyfish-key" 
                  placeholder="${tfConfigured ? '••••••••••••••••' : 'Enter your TinyFish API Key'}"
                  class="flex-1 p-2.5 text-xs bg-slate-950 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-400 font-mono shadow-xs text-white"
                />
                <!-- Test Button (preserves exact ID #btn-test-tinyfish) -->
                <button id="btn-test-tinyfish" class="btn-secondary text-[11px] px-3.5 py-2 font-bold shrink-0 shadow-xs cursor-pointer">
                  Test Connection
                </button>
              </div>
              <div id="tinyfish-test-feedback" class="text-[11px] mt-2 hidden rounded-xl p-2.5 font-medium font-mono"></div>
              <a href="https://agent.tinyfish.ai/api-keys" target="_blank" rel="noopener" class="text-[11px] text-saffron-400 hover:text-saffron-300 font-medium hover:underline inline-flex items-center gap-1 pt-1 font-mono">
                <span>Get your TinyFish API Key at agent.tinyfish.ai</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <!-- Claude API Section (Optional) -->
          <div class="p-5 rounded-2xl border transition-all ${claudeConfigured ? 'bg-emerald-500/[0.06] border-emerald-500/30' : 'bg-white/[0.03] border-white/10'}">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-white text-xs flex items-center gap-2">
                <span>🧠</span>
                <span>Claude API (Reasoning Layer)</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${claudeConfigured ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.05] text-slate-400 border border-white/10'}">
                ${claudeConfigured ? 'Configured' : 'Optional (Built-in Active)'}
              </span>
            </div>

            <p class="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Provides deep semantic policy reasoning. If unconfigured, the system automatically uses the integrated multi-factor eligibility engine.
            </p>

            <div class="space-y-2">
              <label class="font-bold text-[11px] text-slate-300 block font-mono">ANTHROPIC_API_KEY</label>
              <input 
                type="password" 
                id="input-claude-key" 
                placeholder="${claudeConfigured ? '••••••••••••••••' : 'Optional - leave empty for built-in engine'}"
                class="w-full p-2.5 text-xs bg-slate-950 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-400 font-mono shadow-xs text-white"
              />
            </div>
          </div>

        </div>

        <!-- Footer (preserves exact IDs #btn-cancel-settings and #btn-save-settings) -->
        <div class="p-5 bg-[#030712] border-t border-white/10 flex items-center justify-between">
          <span class="text-[11px] text-slate-400 font-mono">Server-side .env isolation</span>
          <div class="flex items-center gap-2.5">
            <button id="btn-cancel-settings" class="btn-secondary text-xs py-2 px-3.5 font-bold cursor-pointer shadow-xs">
              Cancel
            </button>
            <button id="btn-save-settings" class="btn-primary text-xs py-2 px-4.5 font-bold cursor-pointer shadow-glow-saffron">
              Save Credentials
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  const closeBtn = container.querySelector('#btn-close-settings');
  const cancelBtn = container.querySelector('#btn-cancel-settings');
  if (closeBtn) closeBtn.addEventListener('click', onClose);
  if (cancelBtn) cancelBtn.addEventListener('click', onClose);

  // Close on backdrop
  container.firstElementChild?.addEventListener('click', (e) => {
    if (e.target === container.firstElementChild) onClose();
  });

  // Test TinyFish Connection button (preserves exact behavior)
  const testBtn = container.querySelector('#btn-test-tinyfish');
  const feedback = container.querySelector('#tinyfish-test-feedback');
  if (testBtn && feedback) {
    testBtn.addEventListener('click', async () => {
      testBtn.disabled = true;
      testBtn.textContent = 'Testing...';
      feedback.className = 'text-[11px] mt-2 p-2.5 rounded-xl block bg-white/[0.05] text-slate-300 border border-white/10';
      feedback.textContent = 'Probing TinyFish API endpoint...';

      try {
        const result = await api.testTinyFishConnection();
        if (result.success) {
          feedback.className = 'text-[11px] mt-2 p-2.5 rounded-xl block bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold';
          feedback.textContent = `✓ ${result.message} (Latency: ${result.latencyMs}ms)`;
        } else {
          feedback.className = 'text-[11px] mt-2 p-2.5 rounded-xl block bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold';
          feedback.textContent = `⚠️ ${result.message || 'Connection test failed.'}`;
        }
      } catch (err) {
        feedback.className = 'text-[11px] mt-2 p-2.5 rounded-xl block bg-red-500/10 text-red-400 border border-red-500/30 font-semibold';
        feedback.textContent = `❌ ${err.message}`;
      } finally {
        testBtn.disabled = false;
        testBtn.textContent = 'Test Connection';
      }
    });
  }

  // Save Settings button (preserves exact behavior)
  const saveBtn = container.querySelector('#btn-save-settings');
  const tfInput = container.querySelector('#input-tinyfish-key');
  const claudeInput = container.querySelector('#input-claude-key');

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const tfKey = tfInput?.value?.trim();
      const claudeKey = claudeInput?.value?.trim();

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const payload = {};
      if (tfKey) payload.tinyfishApiKey = tfKey;
      if (claudeKey) payload.anthropicApiKey = claudeKey;

      try {
        const res = await api.updateConfigKeys(payload);
        if (res.success) {
          if (onUpdated) onUpdated();
          onClose();
        }
      } catch (err) {
        alert(`Error saving credentials: ${err.message}`);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Credentials';
      }
    });
  }
}
