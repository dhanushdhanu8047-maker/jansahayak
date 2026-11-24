// public/js/components/CitizenProfile.js - Citizen profile inspector & quick editor

export function renderCitizenProfile(container, profile = {}, onProfileChange) {
  const fields = [
    { key: 'age', label: 'Age', val: profile.age ? `${profile.age} Years` : 'Not specified', isSet: Boolean(profile.age), icon: '🎂' },
    { key: 'state', label: 'Domicile / State', val: profile.state || 'Not specified', isSet: Boolean(profile.state), icon: '📍' },
    { key: 'occupation', label: 'Occupation', val: profile.occupation || 'Not specified', isSet: Boolean(profile.occupation), icon: '💼' },
    { key: 'annualIncome', label: 'Annual Income', val: profile.annualIncome ? `₹${Number(profile.annualIncome).toLocaleString('en-IN')}` : 'Not specified', isSet: profile.annualIncome !== undefined && profile.annualIncome !== null, icon: '💵' },
    { key: 'category', label: 'Social Category', val: profile.category || 'Not specified', isSet: Boolean(profile.category), icon: '🏷️' },
    { key: 'gender', label: 'Gender', val: profile.gender || 'Not specified', isSet: Boolean(profile.gender), icon: '👤' },
  ];

  const completedCount = fields.filter(f => f.isSet).length;
  const percentage = Math.round((completedCount / fields.length) * 100);

  container.innerHTML = `
    <div class="bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-glass-cyber p-5 sm:p-6 relative overflow-hidden transition-all hover:border-white/20">
      
      <!-- Top Cyber Neon Gradient Rim -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-amber-400 to-emerald-500 shadow-glow-saffron"></div>

      <!-- Header with Citizen Identity Holographic Aesthetic -->
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-500 via-white to-emerald-500 p-[1.5px] shadow-sm flex items-center justify-center">
            <div class="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center font-mono font-black text-xs text-saffron-400">
              ID
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-white text-sm">Citizen Profile HUD</h3>
              <span class="w-2 h-2 rounded-full ${percentage >= 70 ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-saffron-400 shadow-glow-saffron'} animate-pulse"></span>
            </div>
            <p class="text-[11px] text-slate-400">Synthesized from conversation</p>
          </div>
        </div>
        <div class="text-right bg-white/[0.04] px-3 py-1.5 rounded-2xl border border-white/10">
          <span class="text-xs font-black font-mono ${percentage >= 70 ? 'text-emerald-400' : 'text-saffron-400'}">${percentage}%</span>
          <span class="text-[10px] text-slate-400 block font-medium">Ready</span>
        </div>
      </div>

      <!-- Profile Progress Bar with Glow -->
      <div class="w-full bg-white/[0.06] rounded-full h-2 mb-5 overflow-hidden p-0.5 border border-white/10">
        <div class="h-1.5 rounded-full transition-all duration-700 ease-out ${percentage >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-glow-emerald' : 'bg-gradient-to-r from-saffron-500 to-amber-400 shadow-glow-saffron'}" style="width: ${percentage}%"></div>
      </div>

      <!-- Attributes Grid -->
      <div class="grid grid-cols-2 gap-2.5 text-xs mb-5">
        ${fields.map(f => `
          <div class="p-3 rounded-2xl border transition-all ${f.isSet ? 'bg-white/[0.04] border-white/10 hover:border-white/20' : 'bg-saffron-500/[0.06] border-saffron-500/20'}">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-xs">${f.icon}</span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate font-mono">${f.label}</span>
            </div>
            <span class="font-bold text-slate-100 truncate block text-xs font-mono">${f.val}</span>
          </div>
        `).join('')}
      </div>

      <!-- Quick Adjust Controls -->
      <div class="pt-4 border-t border-white/10">
        <div class="flex items-center justify-between mb-2.5">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Quick Adjustments:</p>
          <span class="text-[10px] text-slate-500">Instant refresh</span>
        </div>
        <div class="flex flex-wrap gap-2 text-xs">
          <button class="profile-quick-pill px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-medium transition-all border border-white/10 hover:border-saffron-400/40 active:scale-95 cursor-pointer" data-key="state" data-val="Karnataka">
            📍 Karnataka
          </button>
          <button class="profile-quick-pill px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-medium transition-all border border-white/10 hover:border-saffron-400/40 active:scale-95 cursor-pointer" data-key="occupation" data-val="Student">
            🎓 Student
          </button>
          <button class="profile-quick-pill px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-medium transition-all border border-white/10 hover:border-saffron-400/40 active:scale-95 cursor-pointer" data-key="occupation" data-val="Farmer">
            🌾 Farmer
          </button>
          <button class="profile-quick-pill px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-medium transition-all border border-white/10 hover:border-saffron-400/40 active:scale-95 cursor-pointer" data-key="occupation" data-val="Entrepreneur">
            💼 Business
          </button>
          <button class="profile-quick-pill px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-medium transition-all border border-white/10 hover:border-saffron-400/40 active:scale-95 cursor-pointer" data-key="annualIncome" data-val="150000">
            💵 Income &lt; ₹1.5L
          </button>
          <button class="profile-quick-pill px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-medium transition-all border border-white/10 hover:border-saffron-400/40 active:scale-95 cursor-pointer" data-key="gender" data-val="Female">
            👩 Female
          </button>
          <button class="profile-quick-pill px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-medium transition-all border border-white/10 hover:border-saffron-400/40 active:scale-95 cursor-pointer" data-key="category" data-val="OBC">
            🏷️ OBC
          </button>
        </div>
      </div>

      <!-- Clear / Reset Action -->
      <div class="mt-4 pt-3.5 border-t border-white/10 flex justify-between items-center text-xs">
        <span class="text-slate-500 text-[10px] font-mono">Live parameter binding</span>
        <button id="btn-reset-profile" class="text-slate-400 hover:text-red-400 font-medium transition-colors flex items-center gap-1.5 text-xs cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          <span>Reset Profile</span>
        </button>
      </div>

    </div>
  `;

  // Attach quick pill clicks (preserves exact contract)
  container.querySelectorAll('.profile-quick-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      let val = btn.dataset.val;
      if (key === 'annualIncome') val = parseInt(val, 10);
      if (key === 'age') val = parseInt(val, 10);

      const updated = { ...profile, [key]: val };
      if (onProfileChange) onProfileChange(updated);
    });
  });

  // Attach reset button click (preserves exact contract)
  const resetBtn = container.querySelector('#btn-reset-profile');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (onProfileChange) onProfileChange({});
    });
  }
}
