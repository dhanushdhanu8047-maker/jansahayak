// public/js/components/SchemeCards.js - Next-Gen Scheme Directory, Live Filtering & Direct Application

export function renderSchemeCards(container, schemes = [], state = {}, onFilterChange, onOpenDetails) {
  const currentFilter = state.resultsFilter || { status: 'All', category: 'All', state: 'All' };
  
  // Available unique categories
  const categories = [
    { name: 'All', icon: '🌐' },
    { name: 'Agriculture & Farming', icon: '🌾' },
    { name: 'Education & Scholarships', icon: '🎓' },
    { name: 'Business & Entrepreneurship', icon: '💼' },
    { name: 'Social Welfare & Low Income', icon: '💰' },
    { name: 'Housing & Urban', icon: '🏠' },
    { name: 'Women Empowerment', icon: '👩' },
    { name: 'Health & Insurance', icon: '🏥' }
  ];

  // Filter schemes
  const filtered = schemes.filter(s => {
    if (currentFilter.status !== 'All') {
      if (currentFilter.status === 'Likely' && s.eligibilityStatus !== 'Likely eligible') return false;
      if (currentFilter.status === 'Possibly' && !s.eligibilityStatus.includes('Possibly')) return false;
      if (currentFilter.status === 'Not' && !s.eligibilityStatus.includes('Not eligible')) return false;
    }
    if (currentFilter.category !== 'All' && s.category !== currentFilter.category) return false;
    if (currentFilter.state !== 'All' && s.state !== 'All India' && s.state !== currentFilter.state) return false;
    return true;
  });

  const likelyCount = schemes.filter(s => s.eligibilityStatus === 'Likely eligible').length;
  const possiblyCount = schemes.filter(s => s.eligibilityStatus && s.eligibilityStatus.includes('Possibly')).length;
  const notEligibleCount = schemes.filter(s => s.eligibilityStatus && s.eligibilityStatus.includes('Not eligible')).length;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <!-- Top Title & Summary Stats -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
        <div>
          <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] text-slate-200 text-xs font-semibold mb-3 border border-white/10 backdrop-blur-xl">
            <span>🇮🇳</span>
            <span class="tracking-wide">National Welfare Directory</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-mono text-emerald-400 font-bold">${schemes.length} Schemes Analyzed</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Verified Schemes & Direct Application</h2>
          <p class="text-slate-400 text-xs sm:text-sm mt-1.5">Strict multi-factor matching against official Indian Government criteria and citizen profiles.</p>
        </div>

        <!-- 3-Tier Summary Counter Chips (preserves exact .filter-status-chip and data-status) -->
        <div class="flex flex-wrap gap-2 text-xs">
          <button class="filter-status-chip px-4 py-2 rounded-xl border font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${currentFilter.status === 'All' ? 'bg-white text-slate-950 border-white shadow-glow-saffron' : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'}" data-status="All">
            All (${schemes.length})
          </button>
          <button class="filter-status-chip px-4 py-2 rounded-xl border font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${currentFilter.status === 'Likely' ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'}" data-status="Likely">
            ✓ Likely Eligible (${likelyCount})
          </button>
          <button class="filter-status-chip px-4 py-2 rounded-xl border font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${currentFilter.status === 'Possibly' ? 'bg-saffron-500 text-slate-950 border-saffron-400 shadow-glow-saffron' : 'bg-saffron-500/10 text-saffron-400 border-saffron-500/30 hover:bg-saffron-500/20'}" data-status="Possibly">
            ⚠ Verification Req (${possiblyCount})
          </button>
          <button class="filter-status-chip px-4 py-2 rounded-xl border font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${currentFilter.status === 'Not' ? 'bg-slate-700 text-white border-slate-600' : 'bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06]'}" data-status="Not">
            ✕ Excluded (${notEligibleCount})
          </button>
        </div>
      </div>

      <!-- Filters & Category Tabs -->
      <div class="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
          <span class="font-bold text-slate-400 uppercase tracking-wider shrink-0 text-[10px] font-mono">Category:</span>
          ${categories.map(cat => `
            <button class="filter-cat-btn px-3.5 py-2 rounded-xl whitespace-nowrap transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${currentFilter.category === cat.name ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white font-extrabold shadow-glow-saffron border border-saffron-400' : 'bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]'}" data-category="${cat.name}">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Domicile Filter -->
        <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span class="text-slate-400 font-semibold text-xs font-mono">Domicile:</span>
          <select id="select-domicile-filter" class="bg-slate-900 border border-white/15 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-saffron-400 cursor-pointer shadow-glass-cyber">
            <option value="All" ${currentFilter.state === 'All' ? 'selected' : ''}>All India & States</option>
            <option value="Karnataka" ${currentFilter.state === 'Karnataka' ? 'selected' : ''}>Karnataka Only</option>
          </select>
        </div>
      </div>

      <!-- Schemes Grid -->
      ${filtered.length === 0 ? `
        <div class="bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-dashed border-white/15 p-16 text-center my-8 shadow-glass-cyber">
          <div class="w-14 h-14 rounded-2xl bg-white/[0.05] text-slate-300 flex items-center justify-center mx-auto mb-4 text-2xl border border-white/10">
            🔍
          </div>
          <h3 class="text-base font-bold text-white mb-1.5">No schemes match the selected category filter</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">Try switching your category or eligibility status filters above.</p>
          <button id="btn-reset-filters" class="btn-secondary text-xs py-2 px-5 font-bold shadow-xs">
            Reset Filters
          </button>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filtered.map(s => {
            const isLikely = s.eligibilityStatus === 'Likely eligible';
            const isPossibly = s.eligibilityStatus && s.eligibilityStatus.includes('Possibly');

            return `
              <div class="scheme-card rounded-3xl p-6 flex flex-col justify-between shadow-glass-cyber relative overflow-hidden group">
                
                <!-- Specular Accent Border -->
                <div class="absolute top-0 left-0 right-0 h-1 ${isLikely ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-glow-emerald' : (isPossibly ? 'bg-gradient-to-r from-saffron-500 to-amber-400 shadow-glow-saffron' : 'bg-slate-700')}"></div>

                <!-- Card Header -->
                <div>
                  <!-- Status & Level Tags -->
                  <div class="flex items-center justify-between gap-2 mb-3.5">
                    <span class="status-pill text-[9px] ${isLikely ? 'status-likely' : (isPossibly ? 'status-possibly' : 'status-not-eligible')}">
                      <span class="w-1.5 h-1.5 rounded-full ${isLikely ? 'bg-emerald-400' : (isPossibly ? 'bg-saffron-400' : 'bg-slate-400')}"></span>
                      ${s.eligibilityStatus || 'Under Review'}
                    </span>
                    
                    <div class="flex items-center gap-1.5 text-[10px]">
                      <span class="px-2.5 py-0.5 rounded-lg font-mono font-bold bg-white/[0.05] text-slate-300 border border-white/10">
                        ${s.level || 'Central'}: ${s.state || 'All India'}
                      </span>
                    </div>
                  </div>

                  <!-- Scheme Title -->
                  <h3 class="font-black text-base text-white mb-1.5 line-clamp-2 leading-snug group-hover:text-saffron-400 transition-colors cursor-pointer card-title-trigger" data-scheme-id="${s.id}">
                    ${s.name}
                  </h3>

                  <!-- Department -->
                  <p class="text-[11px] font-medium text-slate-400 mb-3.5 line-clamp-1 flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>${s.department}</span>
                  </p>

                  <!-- Key Benefit Highlight Box -->
                  <div class="bg-emerald-500/[0.08] border border-emerald-500/25 rounded-2xl p-3.5 mb-3.5">
                    <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1 font-mono">Key Financial & Welfare Benefit:</span>
                    <p class="text-xs font-bold text-white line-clamp-2 leading-relaxed">${s.benefits}</p>
                  </div>

                  <!-- Why it Matches Explanation -->
                  ${s.whyItMatches ? `
                    <div class="text-xs text-slate-300 mb-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 font-mono">Match Justification:</span>
                      <p class="line-clamp-2 leading-relaxed text-[11px] text-slate-300">${s.whyItMatches}</p>
                    </div>
                  ` : ''}

                  <!-- Missing Information Warning if present -->
                  ${s.missingRequirements && s.missingRequirements.length > 0 ? `
                    <div class="text-[11px] text-amber-300 bg-amber-500/[0.08] border border-amber-500/20 rounded-xl p-2.5 mb-3.5 leading-snug">
                      <span class="font-bold">⚠️ Note:</span> ${s.missingRequirements[0]}
                    </div>
                  ` : ''}

                  <!-- Required Documents Preview -->
                  <div class="mb-4">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Documents Required:</span>
                    <div class="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
                      ${(s.documentsRequired || []).slice(0, 3).map(doc => `
                        <span class="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 truncate max-w-[170px] text-[10px] font-medium" title="${doc}">
                          📄 ${doc}
                        </span>
                      `).join('')}
                      ${(s.documentsRequired || []).length > 3 ? `
                        <span class="px-2 py-0.5 rounded-lg bg-white/[0.04] text-[10px] text-slate-400 font-mono font-medium border border-white/10">+${s.documentsRequired.length - 3} more</span>
                      ` : ''}
                    </div>
                  </div>
                </div>

                <!-- Card Footer & Direct Action Buttons -->
                <div class="pt-4 border-t border-white/10">
                  <div class="flex items-center justify-between text-[11px] text-slate-400 mb-3.5">
                    <span class="text-slate-400 font-mono text-[10px]">Verified Portal: .gov.in</span>
                    <span class="text-[10px] font-mono text-emerald-400">● Live Scheme</span>
                  </div>

                  <!-- Direct Dual Action Buttons: Apply Now AND Full Details -->
                  <div class="flex items-center gap-2">
                    <a 
                      href="${s.officialUrl}" 
                      target="_blank" 
                      rel="noopener" 
                      class="flex-1 btn-primary text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-glow-saffron cursor-pointer text-center"
                    >
                      <span>Apply Online</span>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>

                    <button 
                      class="flex-1 btn-secondary text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 btn-view-scheme cursor-pointer text-center" 
                      data-scheme-id="${s.id}"
                    >
                      <span>Full Criteria</span>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>

              </div>
            `;
          }).join('')}
        </div>
      `}

    </div>
  `;

  // Attach filter handlers (preserves exact contract)
  container.querySelectorAll('.filter-status-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      onFilterChange({ ...currentFilter, status: btn.dataset.status });
    });
  });

  container.querySelectorAll('.filter-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      onFilterChange({ ...currentFilter, category: btn.dataset.category });
    });
  });

  const stateSelect = container.querySelector('#select-domicile-filter');
  if (stateSelect) {
    stateSelect.addEventListener('change', (e) => {
      onFilterChange({ ...currentFilter, state: e.target.value });
    });
  }

  const resetBtn = container.querySelector('#btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      onFilterChange({ status: 'All', category: 'All', state: 'All' });
    });
  }

  // Attach modal triggers (preserves exact contract)
  container.querySelectorAll('.btn-view-scheme, .card-title-trigger').forEach(el => {
    el.addEventListener('click', () => {
      onOpenDetails(el.dataset.schemeId);
    });
  });
}
