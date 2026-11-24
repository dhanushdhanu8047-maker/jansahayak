// public/js/components/About.js - Mission, Architecture & Official Sources

export function renderAbout(container) {
  const sources = [
    { name: "myScheme National Platform", url: "https://www.myscheme.gov.in", authority: "MeitY & Digital India Corporation", domain: "myscheme.gov.in" },
    { name: "National Portal of India", url: "https://www.india.gov.in", authority: "National Informatics Centre (NIC)", domain: "india.gov.in" },
    { name: "State Scholarship Portal (SSP Karnataka)", url: "https://ssp.postmatric.karnataka.gov.in", authority: "Government of Karnataka", domain: "karnataka.gov.in" },
    { name: "PM-KISAN Samman Nidhi", url: "https://pmkisan.gov.in", authority: "Ministry of Agriculture & Farmers Welfare", domain: "pmkisan.gov.in" },
    { name: "National Health Authority (PM-JAY)", url: "https://beneficiary.nha.gov.in", authority: "Ministry of Health & Family Welfare", domain: "nha.gov.in" },
    { name: "Seva Sindhu Karnataka", url: "https://sevasindhu.karnataka.gov.in", authority: "Department of e-Governance, Karnataka", domain: "karnataka.gov.in" },
    { name: "PMEGP / KVIC Portal", url: "https://www.kviconline.gov.in", authority: "Ministry of MSME, Govt of India", domain: "kviconline.gov.in" },
    { name: "Pradhan Mantri Awas Yojana", url: "https://pmayg.nic.in", authority: "Ministry of Rural Development", domain: "pmayg.nic.in" }
  ];

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      
      <!-- Page Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/30 text-xs font-semibold mb-4 shadow-glow-saffron font-mono">
          <span>🇮🇳</span>
          <span class="tracking-wide">Civic-Tech for Bharat</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Empowering Indian Citizens to Claim Their Rights
        </h1>
        <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
          JanSahayak AI was built to solve a critical national challenge: millions of deserving citizens miss out on thousands of crores in welfare grants simply because official rules are scattered, opaque, or difficult to navigate.
        </p>
      </div>

      <!-- Mission Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-glass-cyber hover:border-white/20 transition-all">
          <div class="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center text-xl mb-5 shadow-sm">
            🎯
          </div>
          <h3 class="text-xl font-bold text-white mb-2.5">Our Core Mission</h3>
          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
            To provide every Indian citizen—whether a student in Hubballi, a farmer in Raichur, a street vendor in Bengaluru, or an entrepreneur in Mysuru—with an intelligent, unbiased assistant that understands their profile and points them straight to legitimate government benefits.
          </p>
          <div class="p-3.5 bg-white/[0.03] rounded-2xl text-xs text-slate-300 font-medium border border-white/10 flex items-center gap-2">
            <span>💡</span>
            <span>Zero registration fees • Zero commissions • Direct official applications</span>
          </div>
        </div>

        <div class="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-glass-cyber hover:border-white/20 transition-all">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-saffron-600 to-amber-500 text-white flex items-center justify-center text-xl mb-5 shadow-glow-saffron">
            ⚙️
          </div>
          <h3 class="text-xl font-bold text-white mb-2.5">Technology Architecture</h3>
          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
            Engineered on modern full-stack web standards with secure isolation:
          </p>
          <ul class="space-y-2.5 text-xs text-slate-300">
            <li class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-saffron-400 shadow-glow-saffron"></span>
              <span><strong class="text-white">Google Anti-Gravity:</strong> Secure agentic development environment</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-emerald"></span>
              <span><strong class="text-white">TinyFish Web Agent API:</strong> Autonomous research engine for live official portals</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan"></span>
              <span><strong class="text-white">Claude AI Reasoning Layer:</strong> Deep policy synthesis & multi-factor checks</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-slate-400"></span>
              <span><strong class="text-white">Server-Side Security:</strong> Strict API key isolation and prompt defenses</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Official Verified Sources Catalog -->
      <div class="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-glass-cyber mb-16">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span>🏛️</span>
            <span>Verified Government Portals Directory</span>
          </h3>
          <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            .gov.in / .nic.in
          </span>
        </div>
        <p class="text-slate-400 text-xs sm:text-sm mb-6">
          JanSahayak AI prioritizes verified Indian Government portals. Every scheme is cross-referenced against these authoritative sources:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          ${sources.map(src => `
            <a href="${src.url}" target="_blank" rel="noopener" class="p-4 rounded-2xl border border-white/10 hover:border-saffron-500/40 hover:bg-white/[0.04] transition-all flex items-center justify-between group shadow-xs">
              <div>
                <span class="font-bold text-white block group-hover:text-saffron-400 text-xs sm:text-sm transition-colors">${src.name}</span>
                <span class="text-[11px] text-slate-400 block mt-0.5 font-mono">${src.authority}</span>
              </div>
              <span class="text-slate-500 group-hover:text-saffron-400 font-mono text-xs ml-2 shrink-0">↗</span>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- Legal & Advisory Disclaimer -->
      <div class="bg-amber-500/[0.06] border border-amber-500/20 rounded-3xl p-6 sm:p-8 text-xs text-slate-300 leading-relaxed shadow-glass-cyber">
        <h4 class="font-bold text-amber-300 text-sm mb-2 flex items-center gap-2 font-mono">
          <span>⚖️</span>
          <span>Official Legal & Civic Advisory Disclaimer</span>
        </h4>
        <p class="leading-relaxed">
          JanSahayak AI is an independent civic-tech advisory platform built for educational and scheme discovery purposes. JanSahayak AI is not affiliated with, endorsed by, or an official department of the Government of India or the Government of Karnataka. Government schemes, grants, and subsidies are subject to the sole approval and verification of the respective competent government authorities upon formal application.
        </p>
      </div>

    </div>
  `;
}
