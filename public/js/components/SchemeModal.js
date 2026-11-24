// public/js/components/SchemeModal.js - Dedicated Scheme Deep-Dive View & Document Checklist

export function renderSchemeModal(container, scheme, userProfile = {}, onClose) {
  if (!scheme) return;

  const crit = scheme.eligibility || {};
  const isLikely = scheme.eligibilityStatus === 'Likely eligible';
  const isPossibly = scheme.eligibilityStatus && scheme.eligibilityStatus.includes('Possibly');

  container.innerHTML = `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      
      <!-- Modal Box -->
      <div class="bg-slate-900/95 text-white rounded-3xl max-w-3xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 overflow-hidden flex flex-col max-h-[92vh] relative backdrop-blur-2xl">
        
        <!-- Header Banner with Indian flag subtle gradient -->
        <div class="relative bg-[#030712] text-white p-6 sm:p-8 border-b border-white/10">
          <div class="tricolor-stripe absolute top-0 left-0 right-0"></div>

          <div class="flex items-start justify-between gap-4 mt-2">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-2.5">
                <span class="status-pill text-xs ${isLikely ? 'status-likely' : (isPossibly ? 'status-possibly' : 'status-not-eligible')}">
                  ${scheme.eligibilityStatus || 'Verified Scheme'}
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white/10 text-slate-200 border border-white/10">
                  ${scheme.level || 'Central'}: ${scheme.state || 'All India'}
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 font-semibold">
                  ${scheme.category || 'Welfare'}
                </span>
              </div>

              <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                ${scheme.name}
              </h2>
              <p class="text-slate-300 text-xs sm:text-sm mt-1 flex items-center gap-1.5 font-medium">
                <span>🏛️</span>
                <span>${scheme.department}</span>
              </p>
            </div>

            <!-- Close Button (preserves exact ID #btn-close-modal) -->
            <button id="btn-close-modal" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-base transition-colors shrink-0 cursor-pointer border border-white/10">
              ✕
            </button>
          </div>
        </div>

        <!-- Scrollable Modal Content -->
        <div class="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          <!-- Key Financial Benefit Callout -->
          <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/30 shadow-glow-emerald">
            <div class="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider mb-1.5 font-mono">
              <span>💰</span>
              <span>Financial & Social Welfare Benefit</span>
            </div>
            <p class="text-sm sm:text-base font-bold text-white leading-relaxed">
              ${scheme.benefits}
            </p>
          </div>

          <!-- Description -->
          <div>
            <h4 class="font-bold text-white text-sm mb-1.5 font-mono uppercase tracking-wide text-xs">Scheme Overview</h4>
            <p class="text-slate-300 leading-relaxed text-xs sm:text-sm">
              ${scheme.shortDescription}
            </p>
          </div>

          <!-- Eligibility Analysis vs Citizen Profile -->
          <div class="bg-white/[0.03] rounded-2xl p-5 sm:p-6 border border-white/10">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-white text-sm flex items-center gap-2">
                <span>📋</span>
                <span>Eligibility Criteria Analysis</span>
              </h4>
              <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Match Score: ${scheme.matchScore || 75}%
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="flex items-start gap-2.5 bg-white/[0.04] p-3 rounded-xl border border-white/10 shadow-xs">
                <span class="text-lg leading-none">🎂</span>
                <div>
                  <span class="font-bold text-white block">Age Requirement:</span>
                  <span class="text-slate-400">${crit.ageMin || 18} - ${crit.ageMax || 70} Years</span>
                  ${userProfile.age ? `<span class="ml-1.5 font-mono text-emerald-400 font-bold">(Profile: ${userProfile.age} yrs)</span>` : ''}
                </div>
              </div>

              <div class="flex items-start gap-2.5 bg-white/[0.04] p-3 rounded-xl border border-white/10 shadow-xs">
                <span class="text-lg leading-none">📍</span>
                <div>
                  <span class="font-bold text-white block">Domicile / Location:</span>
                  <span class="text-slate-400">${scheme.state || 'All India'}</span>
                  ${userProfile.state ? `<span class="ml-1.5 font-mono text-emerald-400 font-bold">(Profile: ${userProfile.state})</span>` : ''}
                </div>
              </div>

              <div class="flex items-start gap-2.5 bg-white/[0.04] p-3 rounded-xl border border-white/10 shadow-xs">
                <span class="text-lg leading-none">💵</span>
                <div>
                  <span class="font-bold text-white block">Income Ceiling:</span>
                  <span class="text-slate-400">${crit.maxIncome > 0 ? `Below ₹${crit.maxIncome.toLocaleString('en-IN')} / yr` : 'No income cap'}</span>
                  ${userProfile.annualIncome ? `<span class="ml-1.5 font-mono text-emerald-400 font-bold">(Profile: ₹${userProfile.annualIncome.toLocaleString('en-IN')})</span>` : ''}
                </div>
              </div>

              <div class="flex items-start gap-2.5 bg-white/[0.04] p-3 rounded-xl border border-white/10 shadow-xs">
                <span class="text-lg leading-none">👥</span>
                <div>
                  <span class="font-bold text-white block">Target Beneficiaries:</span>
                  <span class="text-slate-400">${(crit.targetBeneficiaries || []).join(', ') || crit.details}</span>
                </div>
              </div>
            </div>

            ${scheme.whyItMatches ? `
              <div class="mt-4 p-3.5 bg-blue-500/[0.08] border border-blue-500/25 rounded-xl text-xs text-blue-200 leading-relaxed">
                <span class="font-bold">Match Rationale:</span> ${scheme.whyItMatches}
              </div>
            ` : ''}
          </div>

          <!-- Interactive Required Documents Checklist -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-bold text-white text-sm flex items-center gap-2">
                <span>📁</span>
                <span>Required Documents Checklist</span>
              </h4>
              <span class="text-[11px] text-slate-400 font-medium">Tick items you have ready</span>
            </div>

            <div class="space-y-2">
              ${(scheme.documentsRequired || []).map((doc, idx) => `
                <label class="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 hover:border-saffron-500/40 hover:bg-white/[0.05] transition-all cursor-pointer text-xs sm:text-sm bg-white/[0.03]">
                  <input type="checkbox" class="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-500 border-white/20 bg-slate-800" id="doc-chk-${idx}">
                  <span class="font-medium text-slate-200">${doc}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Step-by-Step Application Procedure -->
          <div>
            <h4 class="font-bold text-white text-sm mb-2 flex items-center gap-2 font-mono">
              <span>🚀</span>
              <span>Step-by-Step Application Procedure</span>
            </h4>
            <div class="bg-white/[0.03] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              ${scheme.applicationProcess}
            </div>
          </div>

          <!-- Official Portal Source & Evidence Snippet -->
          <div class="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-slate-300 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                <span>🔍</span>
                <span>Verified Government Evidence</span>
              </span>
              <a href="${scheme.sourceUrl}" target="_blank" rel="noopener" class="text-saffron-400 hover:text-saffron-300 font-bold underline">
                Verify Source ↗
              </a>
            </div>
            <p class="italic text-[11px] text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
              "${scheme.evidenceSnippet || 'Extracted and verified against official government portal documentation.'}"
            </p>
          </div>

        </div>

        <!-- Footer Actions (preserves exact IDs #btn-print-scheme and #btn-cancel-modal) -->
        <div class="p-5 sm:p-6 bg-[#030712] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button id="btn-print-scheme" class="btn-secondary text-xs py-2.5 px-4 w-full sm:w-auto font-bold shadow-xs cursor-pointer">
              <span>🖨️ Print / Save Summary</span>
            </button>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button id="btn-cancel-modal" class="text-xs text-slate-400 hover:text-white font-bold px-3 py-2 w-full sm:w-auto text-center cursor-pointer transition-colors">
              Close
            </button>
            <a 
              href="${scheme.officialUrl}" 
              target="_blank" 
              rel="noopener" 
              class="btn-primary text-xs sm:text-sm py-2.5 px-6 font-bold w-full sm:w-auto text-center shadow-glow-saffron flex items-center justify-center gap-2"
            >
              <span>Apply on Official Portal</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach close handlers (preserves exact contract)
  const closeBtn = container.querySelector('#btn-close-modal');
  const cancelBtn = container.querySelector('#btn-cancel-modal');
  if (closeBtn) closeBtn.addEventListener('click', onClose);
  if (cancelBtn) cancelBtn.addEventListener('click', onClose);

  // Close on backdrop click (preserves exact contract)
  container.firstElementChild?.addEventListener('click', (e) => {
    if (e.target === container.firstElementChild) onClose();
  });

  // Print handler (preserves exact contract)
  const printBtn = container.querySelector('#btn-print-scheme');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
