// public/js/components/Assistant.js - Conversational AI Assistant & Live Web Research Feed

export function renderAssistant(container, state, onSendMessage, onSelectFollowUp, onOpenSchemeModal) {
  const messages = state.chatMessages || [];
  const liveAgent = state.liveAgentStatus || null;
  const lastAdvice = state.latestAdvice || null;

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Top Assistant Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div class="flex items-center gap-3 mb-1.5">
            <div class="w-3 h-3 rounded-full bg-emerald-400 pulse-beacon shadow-glow-emerald"></div>
            <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">JanSahayak AI Research Console</h2>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Agentic HUD Active
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400">
            Tell me your background, occupation, state, or family income in plain language.
          </p>
        </div>

        <!-- Quick Switch to Results View (preserves exact ID #btn-view-all-results) -->
        ${lastAdvice && lastAdvice.schemes && lastAdvice.schemes.length > 0 ? `
          <button id="btn-view-all-results" class="btn-navy text-xs sm:text-sm py-2.5 px-5 shadow-glass-cyber self-start sm:self-auto shrink-0 flex items-center gap-2">
            <span>View All ${lastAdvice.schemes.length} Matched Schemes</span>
            <svg class="w-4 h-4 text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Conversational Chat & Results Stream -->
        <div class="lg:col-span-2 flex flex-col bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-glass-cyber overflow-hidden min-h-[600px] max-h-[780px]">
          
          <!-- Live Autonomous Web Agent Status Banner (when active) -->
          ${liveAgent ? `
            <div class="bg-[#030712]/95 text-white p-4 border-b border-white/10 text-xs animate-fade-in flex items-center justify-between agent-scan-bar relative">
              <div class="flex items-center gap-3 relative z-10">
                <span class="w-3 h-3 rounded-full bg-saffron-400 pulse-beacon shrink-0 shadow-glow-saffron"></span>
                <div>
                  <div class="font-bold text-white flex items-center gap-2">
                    <span>${liveAgent.title || 'TinyFish Autonomous Web Research Agent'}</span>
                    <span class="text-[10px] bg-saffron-500/20 px-2.5 py-0.5 rounded-full text-saffron-300 font-mono font-bold border border-saffron-500/30">Step ${liveAgent.step || 1}</span>
                  </div>
                  <p class="text-slate-300 text-[11px] truncate max-w-xs sm:max-w-md mt-0.5 font-normal">${liveAgent.message || 'Scanning official government websites...'}</p>
                </div>
              </div>
              ${liveAgent.streamingUrl ? `
                <a href="${liveAgent.streamingUrl}" target="_blank" rel="noopener" class="shrink-0 text-[11px] bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-black px-3.5 py-1.5 rounded-xl shadow-glow-saffron transition-all relative z-10 flex items-center gap-1.5">
                  <span>Live Browser</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              ` : ''}
            </div>
          ` : ''}

          <!-- Chat Scrollable Feed -->
          <div id="chat-messages-container" class="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-transparent">
            
            <!-- Default Welcome Bot Message -->
            <div class="flex gap-3.5 items-start animate-fade-in">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-500 via-white to-emerald-500 p-[1.5px] shadow-sm shrink-0 flex items-center justify-center">
                <div class="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center font-black text-xs text-saffron-400">
                  JS
                </div>
              </div>
              <div class="chat-bubble-bot p-5 rounded-3xl max-w-xl text-sm space-y-3">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white text-base">Namaste! I am JanSahayak AI</span>
                  <span class="text-base">🙏</span>
                </div>
                <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  I help Indian citizens identify and apply for genuine Central & State Government schemes. Tell me about yourself in natural words — like your age, state, occupation, or family income.
                </p>
                <div class="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span class="inline-flex items-center gap-1 bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-lg font-mono">🏛️ Official .gov.in sources</span>
                  <span class="inline-flex items-center gap-1 bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-lg font-mono">⚡ 3-Tier Multi-factor Check</span>
                </div>
              </div>
            </div>

            <!-- Dynamic Messages History -->
            ${messages.map((msg, i) => `
              <div class="flex gap-3.5 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in">
                ${msg.role !== 'user' ? `
                  <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-500 via-white to-emerald-500 p-[1.5px] shadow-sm shrink-0 flex items-center justify-center">
                    <div class="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center font-black text-xs text-saffron-400">
                      JS
                    </div>
                  </div>
                ` : ''}

                <div class="${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} p-5 rounded-3xl max-w-xl text-sm shadow-glass-cyber space-y-3">
                  <p class="leading-relaxed whitespace-pre-line text-xs sm:text-sm">${msg.content}</p>

                  <!-- If bot response contains evaluated schemes preview -->
                  ${msg.schemes && msg.schemes.length > 0 ? `
                    <div class="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                      <div class="flex items-center justify-between">
                        <p class="text-xs font-bold text-white uppercase tracking-wider font-mono">Top Matched Schemes:</p>
                        <span class="text-[10px] text-slate-400 font-mono">${msg.schemes.length} Evaluated</span>
                      </div>
                      
                      <div class="space-y-2.5">
                        ${msg.schemes.slice(0, 3).map(s => `
                          <div class="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-saffron-500/40 hover:bg-white/[0.06] transition-all flex items-center justify-between gap-3 shadow-xs">
                            <div class="min-w-0 flex-1">
                              <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span class="status-pill text-[9px] py-0 px-2 ${s.eligibilityStatus === 'Likely eligible' ? 'status-likely' : (s.eligibilityStatus && s.eligibilityStatus.includes('Possibly') ? 'status-possibly' : 'status-not-eligible')}">
                                  ${s.eligibilityStatus}
                                </span>
                                <span class="text-[10px] text-slate-400 font-mono bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/10">${s.level || 'Central'}</span>
                              </div>
                              <h4 class="font-bold text-xs text-white truncate">${s.name}</h4>
                              <p class="text-[11px] text-emerald-400 font-semibold truncate mt-0.5">${s.benefits}</p>
                            </div>
                            <button class="btn-open-scheme-modal shrink-0 text-xs font-bold text-saffron-400 hover:text-white px-3 py-1.5 bg-saffron-500/10 hover:bg-saffron-500/30 rounded-xl border border-saffron-500/30 transition-all cursor-pointer" data-scheme-id="${s.id}">
                              Details ↗
                            </button>
                          </div>
                        `).join('')}
                      </div>

                      ${msg.schemes.length > 3 ? `
                        <button id="btn-see-more-matches" class="w-full mt-3 py-2 text-xs text-center font-bold text-saffron-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all cursor-pointer font-mono">
                          View All ${msg.schemes.length} Schemes in Directory →
                        </button>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- Disclaimer if present -->
                  ${msg.disclaimer ? `
                    <p class="text-[10px] text-slate-400 italic pt-2 border-t border-white/10">${msg.disclaimer}</p>
                  ` : ''}
                </div>

                ${msg.role === 'user' ? `
                  <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-glow-saffron">
                    You
                  </div>
                ` : ''}
              </div>
            `).join('')}

            <!-- Loading Indicator while research is happening -->
            ${state.isSearching ? `
              <div class="flex gap-3.5 items-start animate-fade-in">
                <div class="w-10 h-10 rounded-2xl bg-[#030712] border border-white/20 text-saffron-400 flex items-center justify-center font-black text-xs shrink-0">
                  JS
                </div>
                <div class="chat-bubble-bot p-5 rounded-3xl text-xs space-y-2 text-slate-300 max-w-md">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-saffron-400 animate-ping"></span>
                    <span class="font-bold text-white">Autonomous Web Agent Navigating Official Portals...</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-mono">
                    Accessing myScheme, SSP Karnataka, and verifying eligibility criteria...
                  </p>
                </div>
              </div>
            ` : ''}

          </div>

          <!-- Interactive Follow-Up Questions (Chips) -->
          ${state.followUpQuestions && state.followUpQuestions.length > 0 && !state.isSearching ? `
            <div class="px-5 py-4 bg-saffron-500/[0.08] border-t border-saffron-500/20 text-xs">
              <span class="text-[11px] font-bold text-saffron-300 block mb-2.5 flex items-center gap-2 font-mono">
                <svg class="w-4 h-4 text-saffron-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>${state.followUpQuestions[0].text}</span>
              </span>
              <div class="flex flex-wrap gap-2">
                ${state.followUpQuestions[0].options.map(opt => `
                  <button class="follow-up-opt-btn px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-saffron-500/20 border border-white/10 hover:border-saffron-400/50 text-slate-200 hover:text-white font-semibold text-xs transition-all shadow-xs active:scale-95 cursor-pointer" data-option="${encodeURIComponent(opt)}">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Input Box -->
          <div class="p-4 bg-[#030712]/90 border-t border-white/10">
            <form id="assistant-chat-form" class="flex gap-3 items-center">
              <input 
                type="text" 
                id="assistant-chat-input" 
                placeholder="Type your background (e.g. 22yo student Karnataka, or farmer looking for subsidy)..."
                class="flex-1 py-3.5 px-4 text-xs sm:text-sm bg-white/[0.05] border border-white/10 rounded-2xl focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400 text-white placeholder-slate-500 transition-all font-normal"
                autocomplete="off"
                ${state.isSearching ? 'disabled' : ''}
              />
              <button 
                type="submit" 
                class="btn-primary py-3.5 px-6 text-xs sm:text-sm rounded-2xl font-bold shrink-0 ${state.isSearching ? 'opacity-50 cursor-not-allowed' : ''}"
                ${state.isSearching ? 'disabled' : ''}
              >
                <span>Send</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </form>
          </div>

        </div>

        <!-- Right 1 Col: Citizen Profile & Active Agent Feed -->
        <div class="space-y-6">
          <div id="assistant-profile-mount"></div>

          <!-- Official Portals Inspected -->
          <div class="bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-glass-cyber text-xs">
            <h4 class="font-bold text-white mb-3.5 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span>🏛️</span>
                <span>Verified Official Portals</span>
              </span>
              <span class="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">100% Gov</span>
            </h4>
            <ul class="space-y-2.5 text-slate-300">
              <li class="flex items-center justify-between py-1.5 border-b border-white/10">
                <span class="font-medium">myScheme National Platform</span>
                <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono font-semibold border border-emerald-500/20">Online</span>
              </li>
              <li class="flex items-center justify-between py-1.5 border-b border-white/10">
                <span class="font-medium">SSP Karnataka (Scholarships)</span>
                <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono font-semibold border border-emerald-500/20">Online</span>
              </li>
              <li class="flex items-center justify-between py-1.5 border-b border-white/10">
                <span class="font-medium">PM-KISAN / Raitha Vidya</span>
                <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono font-semibold border border-emerald-500/20">Online</span>
              </li>
              <li class="flex items-center justify-between py-1.5">
                <span class="font-medium">National Portal of India</span>
                <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono font-semibold border border-emerald-500/20">Online</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  `;

  // Attach submit handler (preserves exact contract)
  const form = container.querySelector('#assistant-chat-form');
  const input = container.querySelector('#assistant-chat-input');
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        input.value = '';
        onSendMessage(text);
      }
    });
  }

  // Attach follow up option clicks (preserves exact contract)
  container.querySelectorAll('.follow-up-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = decodeURIComponent(btn.dataset.option);
      onSelectFollowUp(opt);
    });
  });

  // Attach scheme modal buttons (preserves exact contract)
  container.querySelectorAll('.btn-open-scheme-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.schemeId;
      onOpenSchemeModal(id);
    });
  });

  // See more matches button
  const seeMoreBtn = container.querySelector('#btn-see-more-matches');
  if (seeMoreBtn && window.app) {
    seeMoreBtn.addEventListener('click', () => {
      window.app.setTab('schemes');
    });
  }

  // View all results button in header
  const viewAllBtn = container.querySelector('#btn-view-all-results');
  if (viewAllBtn && window.app) {
    viewAllBtn.addEventListener('click', () => {
      window.app.setTab('schemes');
    });
  }

  // Scroll chat messages container to bottom
  const chatContainer = container.querySelector('#chat-messages-container');
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}
