// public/js/components/Hero.js - High-converting Lovable AI Hero & 3D Interactive Launcher
export function renderHero(container, state, onSearchQuery, onSelectScheme) {
  const smartExamples = [
    {
      label: "Karnataka Student",
      query: "I am a 22-year-old student from Karnataka. What scholarships can I apply for?",
      tag: "Scholarships",
      icon: "🎓"
    },
    {
      label: "Farmer Financial Aid",
      query: "I am a farmer in Karnataka. What financial assistance can I receive?",
      tag: "Agriculture",
      icon: "🌾"
    },
    {
      label: "Small Business / MSME",
      query: "I want to start a small business. What government support is available?",
      tag: "MSME Loans",
      icon: "💼"
    },
    {
      label: "Income < ₹2 Lakh",
      query: "My family income is below ₹2 lakh. What government schemes are available?",
      tag: "Welfare",
      icon: "💰"
    },
    {
      label: "Women Entrepreneurs",
      query: "What schemes are available for women entrepreneurs?",
      tag: "Empowerment",
      icon: "👩"
    },
    {
      label: "Housing Assistance",
      query: "What housing assistance can my family receive?",
      tag: "PMAY",
      icon: "🏠"
    }
  ];

  container.innerHTML = `
    <div class="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-36">
      
      <!-- Ambient Lighting & Radial Glow Orbs -->
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-saffron-500/20 via-cyan-500/10 to-emerald-500/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <!-- Next-Gen Holographic Sovereign AI Badge -->
        <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/15 text-slate-200 text-xs sm:text-sm font-medium mb-8 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,255,255,0.06)] hover:border-saffron-400/50 hover:shadow-glow-saffron transition-all cursor-default">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-saffron-500/20 text-xs">🇮🇳</span>
          <span class="font-extrabold tracking-wide text-white">JanSahayak AI</span>
          <span class="text-white/20">•</span>
          <span class="text-slate-300 font-mono text-xs">Official Bharat Welfare Discovery</span>
          <span class="flex h-2.5 w-2.5 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span class="text-emerald-400 font-mono text-[11px] font-bold">Autonomous</span>
        </div>

        <!-- Main Hero Title with Dual-tone Cybernetic Gradient -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.08]">
          Find Government Schemes <br class="hidden sm:inline"/>
          <span class="bg-gradient-to-r from-saffron-400 via-amber-200 via-white to-emerald-400 bg-clip-text text-transparent">
            Built Strictly For You.
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 font-normal mb-10 leading-relaxed">
          Autonomous AI agents navigate official portals including <span class="text-white font-semibold underline decoration-saffron-400 decoration-2 underline-offset-4">myScheme</span>, <span class="text-white font-semibold underline decoration-emerald-400 decoration-2 underline-offset-4">SSP Karnataka</span>, and Central Ministries to instantly compute your exact 3-tier eligibility.
        </p>

        <!-- Search Bar with Neon Edge Ring -->
        <div class="max-w-3xl mx-auto mb-10">
          <form id="hero-search-form" class="relative bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center gap-3 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] focus-within:border-saffron-400 focus-within:ring-4 focus-within:ring-saffron-500/20 transition-all">
            <div class="flex items-center gap-3.5 w-full px-3 py-1.5 sm:py-0">
              <div class="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-saffron-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input 
                type="text" 
                id="hero-search-input" 
                placeholder="E.g., I am a 22-year-old student from Karnataka looking for scholarships..."
                class="w-full text-white placeholder-slate-400 text-sm sm:text-base font-normal bg-transparent focus:outline-none"
                autocomplete="off"
              />
            </div>
            <button 
              type="submit" 
              class="w-full sm:w-auto btn-primary shrink-0 text-sm sm:text-base py-3 px-7 rounded-2xl font-bold shadow-glow-saffron cursor-pointer"
            >
              <span>Scan Eligible Schemes</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </form>
        </div>

        <!-- Smart Search Example Chips (Phase 5) -->
        <div class="max-w-3xl mx-auto text-left">
          <div class="flex items-center gap-2 mb-3.5">
            <span class="flex h-2 w-2 rounded-full bg-saffron-400 shadow-glow-saffron"></span>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Instant Smart Search Prompts:
            </p>
          </div>
          <div class="flex flex-wrap gap-2.5">
            ${smartExamples.map((ex) => `
              <button 
                class="hero-chip group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-saffron-400/40 text-xs sm:text-sm text-slate-200 transition-all cursor-pointer backdrop-blur-xl shadow-xs active:scale-95"
                data-query="${encodeURIComponent(ex.query)}"
              >
                <span class="text-sm leading-none">${ex.icon}</span>
                <span class="font-medium group-hover:text-white">${ex.label}</span>
                <span class="text-[10px] text-slate-400 bg-white/10 group-hover:bg-saffron-500/20 group-hover:text-saffron-300 px-2 py-0.5 rounded-lg font-mono transition-colors">${ex.tag}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 3D Bento Trust Badges -->
        <div class="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
            <div class="text-2xl sm:text-3xl font-black text-white mb-1 font-mono tracking-tight">100%</div>
            <div class="text-xs text-slate-400 font-medium">Official Government Portals</div>
          </div>
          <div class="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-emerald-500/40 hover:shadow-glow-emerald transition-all">
            <div class="text-2xl sm:text-3xl font-black text-emerald-400 mb-1 font-mono tracking-tight">3-Tier</div>
            <div class="text-xs text-slate-400 font-medium">Strict Eligibility Verification</div>
          </div>
          <div class="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-saffron-500/40 hover:shadow-glow-saffron transition-all">
            <div class="text-2xl sm:text-3xl font-black text-saffron-400 mb-1 font-mono tracking-tight">TinyFish</div>
            <div class="text-xs text-slate-400 font-medium">Autonomous Web Agent</div>
          </div>
          <div class="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
            <div class="text-2xl sm:text-3xl font-black text-white mb-1 font-mono tracking-tight">Zero</div>
            <div class="text-xs text-slate-400 font-medium">Fabricated Schemes / Lies</div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach submit handler (preserves exact contract)
  const form = container.querySelector('#hero-search-form');
  const input = container.querySelector('#hero-search-input');
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val) onSearchQuery(val);
    });
  }

  // Attach chip click handlers (preserves exact contract)
  container.querySelectorAll('.hero-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = decodeURIComponent(btn.dataset.query);
      onSearchQuery(q);
    });
  });
}
