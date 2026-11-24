// public/js/components/HowItWorks.js - 4-Step Architecture Flow & Trust Section

export function renderHowItWorks(container, onGetStarted) {
  const steps = [
    {
      num: "01",
      title: "Express Your Needs Naturally",
      desc: "Describe your background, age, occupation, location, and income in conversational words. No complex government bureaucracy or legal jargon required.",
      icon: "🗣️"
    },
    {
      num: "02",
      title: "Autonomous Agent Web Research",
      desc: "Our TinyFish web research agent navigates official Indian government portals (myscheme.gov.in, SSP Karnataka, pmindia.gov.in) to locate authentic schemes.",
      icon: "🤖"
    },
    {
      num: "03",
      title: "3-Tier Eligibility Classification",
      desc: "Multi-point algorithms rigorously compare your age, state domicile, and income caps, categorizing results into Likely Eligible, Verification Required, or Excluded.",
      icon: "⚖️"
    },
    {
      num: "04",
      title: "Direct Application With Checklists",
      desc: "Review required certificates, step-by-step application instructions, and jump straight into the official government submission portal.",
      icon: "🚀"
    }
  ];

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] text-slate-200 text-xs font-semibold mb-4 border border-white/10 backdrop-blur-xl">
          <span>🏛️</span>
          <span class="tracking-wide font-mono">Transparent Technology Architecture</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          How JanSahayak AI Works
        </h2>
        <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
          Bridging the gap between 1.4 billion Indian citizens and thousands of welfare benefits through autonomous web agents and intelligent eligibility matching.
        </p>
      </div>

      <!-- 4-Step Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 sm:mb-24">
        ${steps.map((st) => `
          <div class="relative bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-7 border border-white/10 shadow-glass-cyber flex flex-col justify-between hover:border-saffron-500/40 hover:shadow-glow-saffron transition-all group">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500/0 via-saffron-500 to-saffron-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ${st.icon}
                </div>
                <span class="font-mono font-extrabold text-xs text-saffron-400 bg-saffron-500/10 px-3 py-1 rounded-xl border border-saffron-500/30">
                  Step ${st.num}
                </span>
              </div>
              <h3 class="font-bold text-base text-white mb-2 leading-snug">
                ${st.title}
              </h3>
              <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">
                ${st.desc}
              </p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Trust & Verification Grid -->
      <div class="bg-slate-900/90 backdrop-blur-2xl text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-white/15 shadow-glass-cyber">
        <div class="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute top-0 right-1/3 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-3xl relative z-10">
          <span class="text-xs uppercase font-extrabold tracking-widest text-saffron-400 block mb-2 font-mono">Our Integrity Commitment</span>
          <h3 class="text-2xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Built for Truth. Grounded in Official Sources.
          </h3>
          <p class="text-slate-300 text-sm leading-relaxed mb-8">
            Government welfare is a constitutional lifeline, not a guessing game. JanSahayak AI never invents schemes, never generates fake approvals, and never acts as an unauthorized intermediary. All schemes link directly to authentic government domains (.gov.in / .nic.in).
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs">
            <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div class="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                <span class="text-emerald-400">✓</span> Zero Hallucinations
              </div>
              <p class="text-slate-400 leading-relaxed">If a query yields no verifiable government match, we state it transparently rather than fabricating details.</p>
            </div>
            <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div class="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                <span class="text-emerald-400">✓</span> Citizen Privacy First
              </div>
              <p class="text-slate-400 leading-relaxed">We do not store your Aadhaar, bank records, or personal identifying data on any third-party servers.</p>
            </div>
            <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div class="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                <span class="text-emerald-400">✓</span> Direct Government Portals
              </div>
              <p class="text-slate-400 leading-relaxed">Applications are completed on official government portals with no middlemen fees or commissions.</p>
            </div>
          </div>

          <!-- CTA Button (preserves exact ID #btn-how-start) -->
          <div class="mt-10">
            <button id="btn-how-start" class="btn-primary text-sm py-3.5 px-8 rounded-xl font-bold shadow-glow-saffron cursor-pointer">
              <span>Start Discovering Your Schemes Now</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach button click (preserves exact contract)
  const btn = container.querySelector('#btn-how-start');
  if (btn) btn.addEventListener('click', onGetStarted);
}
