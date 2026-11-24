// public/js/components/Navbar.js - Next-Gen Glassmorphism Navigation

export function renderNavbar(container, state, onNavigate, onOpenSettings) {
  const isTfActive = state.health?.config?.tinyfishConfigured;

  container.innerHTML = `
    <header class="glass-nav sticky top-0 z-40 w-full transition-all">
      <div class="tricolor-stripe"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          
          <!-- Logo & Branding -->
          <div class="flex items-center gap-3.5 cursor-pointer group" id="nav-brand">
            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-saffron-500 via-white to-emerald-500 p-[1.5px] shadow-glow-saffron group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <div class="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center font-black text-sm sm:text-base">
                <span class="text-saffron-400">जन</span><span class="text-emerald-400">S</span>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-white font-black text-lg sm:text-xl tracking-tight group-hover:text-saffron-400 transition-colors">JanSahayak</span>
                <span class="bg-gradient-to-r from-saffron-500/20 to-amber-500/20 text-saffron-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-saffron-500/30 font-bold tracking-wider uppercase">AI</span>
              </div>
              <p class="text-slate-400 text-[11px] hidden sm:flex items-center gap-1.5 font-medium font-mono">
                <span>Personal AI Government Scheme Assistant</span>
              </p>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-1.5 lg:gap-2 bg-white/[0.04] p-1.5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-2xl">
            <button class="nav-link px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${state.currentTab === 'home' ? 'text-white bg-white/15 shadow-sm shadow-black/40 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'}" data-tab="home">Home</button>
            <button class="nav-link px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${state.currentTab === 'assistant' ? 'text-white bg-white/15 shadow-sm shadow-black/40 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'}" data-tab="assistant">AI Assistant</button>
            <button class="nav-link px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${state.currentTab === 'schemes' ? 'text-white bg-white/15 shadow-sm shadow-black/40 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'}" data-tab="schemes">Explore Schemes</button>
            <button class="nav-link px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${state.currentTab === 'how-it-works' ? 'text-white bg-white/15 shadow-sm shadow-black/40 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'}" data-tab="how-it-works">How It Works</button>
            <button class="nav-link px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${state.currentTab === 'about' ? 'text-white bg-white/15 shadow-sm shadow-black/40 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'}" data-tab="about">About</button>
          </nav>

          <!-- Right Action & Status -->
          <div class="flex items-center gap-2.5 sm:gap-3">
            <!-- TinyFish Live Badge -->
            <button id="btn-api-status" class="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isTfActive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-glow-emerald' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }" title="Click to test or configure TinyFish API">
              <span class="w-2 h-2 rounded-full ${isTfActive ? 'bg-emerald-400 pulse-beacon' : 'bg-amber-400'}"></span>
              <span class="hidden sm:inline font-mono font-bold">${isTfActive ? 'TinyFish: Active' : 'API Settings'}</span>
              <span class="sm:hidden font-mono font-bold">${isTfActive ? 'Active' : 'API'}</span>
            </button>

            <!-- Action Button -->
            <button id="nav-btn-find" class="btn-primary text-xs sm:text-sm py-2 px-4 sm:px-5 shadow-glow-saffron cursor-pointer">
              <span>Find Schemes</span>
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="flex md:hidden border-t border-white/10 px-2 py-2.5 bg-[#030712]/95 backdrop-blur-2xl justify-around text-xs font-semibold text-slate-300">
        <button class="py-1 px-3 rounded-lg transition-colors cursor-pointer ${state.currentTab === 'home' ? 'text-saffron-400 bg-white/10 font-bold' : ''}" data-tab="home">Home</button>
        <button class="py-1 px-3 rounded-lg transition-colors cursor-pointer ${state.currentTab === 'assistant' ? 'text-saffron-400 bg-white/10 font-bold' : ''}" data-tab="assistant">AI Assistant</button>
        <button class="py-1 px-3 rounded-lg transition-colors cursor-pointer ${state.currentTab === 'schemes' ? 'text-saffron-400 bg-white/10 font-bold' : ''}" data-tab="schemes">Schemes</button>
        <button class="py-1 px-3 rounded-lg transition-colors cursor-pointer ${state.currentTab === 'about' ? 'text-saffron-400 bg-white/10 font-bold' : ''}" data-tab="about">About</button>
      </div>
    </header>
  `;

  // Attach navigation listeners
  container.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => onNavigate(btn.dataset.tab));
  });

  const brand = container.querySelector('#nav-brand');
  if (brand) brand.addEventListener('click', () => onNavigate('home'));

  const findBtn = container.querySelector('#nav-btn-find');
  if (findBtn) findBtn.addEventListener('click', () => onNavigate('assistant'));

  const apiStatusBtn = container.querySelector('#btn-api-status');
  if (apiStatusBtn) apiStatusBtn.addEventListener('click', onOpenSettings);
}
