import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-[#0da6f2] to-[#14b8a6]"></div>
        <div class="px-8 pb-8">
          <div class="relative flex justify-between items-end -mt-12 mb-6">
            <div class="flex items-end gap-6">
              <img src="https://picsum.photos/seed/sarah/200/200" alt="Profile" class="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover">
              <div class="mb-1">
                <h1 class="text-2xl font-bold text-slate-900">Agent Sarah</h1>
                <p class="text-slate-500 font-medium">Senior Sourcing Specialist</p>
              </div>
            </div>
            <button class="px-4 py-2 bg-[#0da6f2] text-white rounded-lg font-bold text-sm hover:bg-[#0da6f2]/90 transition-colors">
              Edit Profile
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2 space-y-8">
              <section>
                <h3 class="text-lg font-bold text-slate-900 mb-4">About</h3>
                <p class="text-slate-600 leading-relaxed">
                  Specializing in AI-driven procurement and strategic sourcing for enterprise technology. 
                  Leveraging X Agents platform to identify high-value partners in emerging markets.
                </p>
              </section>

              <section>
                <h3 class="text-lg font-bold text-slate-900 mb-4">Current Focus</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">AI Infrastructure</span>
                  <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Green Energy</span>
                  <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Supply Chain Optimization</span>
                </div>
              </section>
            </div>

            <div class="space-y-6">
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Subscription</h4>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-slate-900">Pro Tier</span>
                  <span class="text-green-500 text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p class="text-xs text-slate-500">Next billing: Oct 24, 2026</p>
              </div>

              <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Usage Stats</h4>
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="text-slate-600">Searches</span>
                      <span class="font-bold text-slate-900">450/500</span>
                    </div>
                    <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div class="h-full bg-[#0da6f2] w-[90%]"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="text-slate-600">Exports</span>
                      <span class="font-bold text-slate-900">12/50</span>
                    </div>
                    <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div class="h-full bg-green-500 w-[24%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {}
