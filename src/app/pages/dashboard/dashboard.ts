import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-[1440px] mx-auto px-4 md:px-10 py-8">
      <!-- Hero Section -->
      <section class="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-8 md:p-12 mb-8 group ring-1 ring-[#0da6f2]/30 shadow-[0_0_50px_-12px_rgba(13,166,242,0.3)]">
        <div class="absolute inset-0 bg-[radial-gradient(circle,#0da6f2_1px,transparent_1px)] bg-[length:30px_30px] opacity-5"></div>
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0da6f2]/20 to-transparent pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="max-w-2xl text-center md:text-left">
            <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Welcome back, <span class="text-[#0da6f2] italic">Agent Sarah</span>
            </h2>
            <p class="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed">
              Your Gen-AI Sourcing Assistant is synchronized and ready. Discover your next high-impact opportunity with neural-precision targeting.
            </p>
            <button routerLink="/sourcing-wizard" class="bg-[#0da6f2] hover:bg-[#0da6f2]/90 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#0da6f2]/20 cursor-pointer">
              <span class="material-symbols-outlined">add_circle</span>
              Start New Sourcing Project
            </button>
          </div>
          <div class="hidden lg:block relative">
            <div class="w-64 h-64 border-2 border-[#0da6f2]/30 rounded-full animate-pulse flex items-center justify-center">
              <div class="w-48 h-48 border-2 border-[#0da6f2]/50 rounded-full flex items-center justify-center relative">
                <div class="absolute inset-0 rounded-full border border-[#0da6f2]/20 animate-[spin_10s_linear_infinite]"></div>
                <div class="absolute inset-2 rounded-full border border-[#0da6f2]/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                <span class="material-symbols-outlined text-[#0da6f2] text-6xl drop-shadow-[0_0_10px_rgba(13,166,242,0.8)]">hub</span>
              </div>
            </div>
            <div class="absolute top-0 right-0 bg-[#0da6f2]/10 backdrop-blur-md border border-[#0da6f2]/30 p-4 rounded-xl">
              <p class="text-[10px] uppercase tracking-tighter text-[#0da6f2] font-bold">System Status</p>
              <p class="text-xs">All Nodes Operational</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Metrics Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white p-6 rounded-xl border border-[#0da6f2]/10 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-[#0da6f2]/10 rounded-lg text-[#0da6f2]">
              <span class="material-symbols-outlined">domain</span>
            </div>
            <span class="text-green-500 text-xs font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">trending_up</span> +12%
            </span>
          </div>
          <p class="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Sourced Domains</p>
          <h3 class="text-3xl font-bold tracking-tight">1,248</h3>
          <div class="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#0da6f2] h-full rounded-full" style="width: 75%"></div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-xl border border-[#0da6f2]/10 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-[#0da6f2]/10 rounded-lg text-[#0da6f2]">
              <span class="material-symbols-outlined">fact_check</span>
            </div>
            <span class="text-green-500 text-xs font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">trending_up</span> +5%
            </span>
          </div>
          <p class="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Validated Use Cases</p>
          <h3 class="text-3xl font-bold tracking-tight">18</h3>
          <div class="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#0da6f2] h-full rounded-full" style="width: 45%"></div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-xl border border-[#0da6f2]/10 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-[#0da6f2]/10 rounded-lg text-[#0da6f2]">
              <span class="material-symbols-outlined">bolt</span>
            </div>
            <span class="text-[#0da6f2] text-xs font-bold">Monthly Quota</span>
          </div>
          <p class="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Search Credits</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold tracking-tight">450</h3>
            <span class="text-slate-400 text-sm">/ 500</span>
          </div>
          <div class="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#0da6f2] h-full rounded-full" style="width: 90%"></div>
          </div>
        </div>
      </section>

      <!-- Recent Activity Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-bold tracking-tight">Recent Projects</h2>
            <span class="px-2 py-0.5 bg-[#0da6f2]/10 text-[#0da6f2] text-[10px] font-black uppercase rounded tracking-widest">Active Now</span>
          </div>
          <button routerLink="/companies" class="text-[#0da6f2] text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
            View All <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Activity Card 1 -->
          <div class="group relative bg-white border border-[#0da6f2]/10 rounded-xl overflow-hidden hover:border-[#0da6f2]/40 transition-all hover:-translate-y-1 shadow-sm backdrop-blur-sm bg-white/80 hover:shadow-[0_0_30px_rgba(13,166,242,0.4)]">
            <div class="h-32 bg-slate-100 relative overflow-hidden">
              <img alt="AI Visualization" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" src="https://picsum.photos/seed/ai/600/300"/>
              <div class="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div class="p-6 relative -mt-8">
              <div class="flex justify-between items-start mb-3">
                <span class="bg-[#0da6f2]/10 text-[#0da6f2] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Technology</span>
                <div class="flex items-center gap-1 text-green-500">
                  <span class="material-symbols-outlined text-sm">check_circle</span>
                  <span class="text-[10px] font-bold uppercase tracking-wider">SEARCH_COMPLETED</span>
                </div>
              </div>
              <h4 class="text-xl font-bold mb-2">AI Data Labeling Automation</h4>
              <p class="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">Optimization of synthetic data generation for computer vision models in autonomous driving.</p>
              <button routerLink="/companies" class="w-full border border-[#0da6f2]/20 group-hover:bg-[#0da6f2] group-hover:text-white transition-colors py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
                Resume Mission <span class="material-symbols-outlined text-sm">bolt</span>
              </button>
            </div>
          </div>
          <!-- Activity Card 2 -->
          <div class="group relative bg-white border border-[#0da6f2]/10 rounded-xl overflow-hidden hover:border-[#0da6f2]/40 transition-all hover:-translate-y-1 shadow-sm backdrop-blur-sm bg-white/80 hover:shadow-[0_0_30px_rgba(13,166,242,0.4)]">
            <div class="h-32 bg-slate-100 relative overflow-hidden">
              <img alt="Sustainable Fashion" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" src="https://picsum.photos/seed/fashion/600/300"/>
              <div class="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div class="p-6 relative -mt-8">
              <div class="flex justify-between items-start mb-3">
                <span class="bg-[#0da6f2]/10 text-[#0da6f2] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">E-Commerce</span>
                <div class="flex items-center gap-1 text-amber-500">
                  <span class="material-symbols-outlined text-sm">pending</span>
                  <span class="text-[10px] font-bold uppercase tracking-wider">TOPICS_DEFINED</span>
                </div>
              </div>
              <h4 class="text-xl font-bold mb-2">Sustainable Fashion Supply</h4>
              <p class="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">Identifying circular economy partners for boutique clothing manufacturers in Western Europe.</p>
              <button routerLink="/companies" class="w-full border border-[#0da6f2]/20 group-hover:bg-[#0da6f2] group-hover:text-white transition-colors py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
                Resume Mission <span class="material-symbols-outlined text-sm">bolt</span>
              </button>
            </div>
          </div>
          <!-- Activity Card 3 -->
          <div class="group relative bg-white border border-[#0da6f2]/10 rounded-xl overflow-hidden hover:border-[#0da6f2]/40 transition-all hover:-translate-y-1 shadow-sm backdrop-blur-sm bg-white/80 hover:shadow-[0_0_30px_rgba(13,166,242,0.4)]">
            <div class="h-32 bg-slate-100 relative overflow-hidden">
              <img alt="FinTech Analysis" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" src="https://picsum.photos/seed/finance/600/300"/>
              <div class="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div class="p-6 relative -mt-8">
              <div class="flex justify-between items-start mb-3">
                <span class="bg-[#0da6f2]/10 text-[#0da6f2] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Finance</span>
                <div class="flex items-center gap-1 text-green-500">
                  <span class="material-symbols-outlined text-sm">check_circle</span>
                  <span class="text-[10px] font-bold uppercase tracking-wider">SEARCH_COMPLETED</span>
                </div>
              </div>
              <h4 class="text-xl font-bold mb-2">FinTech Regulatory Compliance</h4>
              <p class="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">Mapping cross-border payment license requirements across SEPA and APAC regions.</p>
              <button routerLink="/companies" class="w-full border border-[#0da6f2]/20 group-hover:bg-[#0da6f2] group-hover:text-white transition-colors py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
                Resume Mission <span class="material-symbols-outlined text-sm">bolt</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class DashboardComponent {}
