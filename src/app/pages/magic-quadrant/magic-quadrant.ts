import { Component, computed, inject, signal } from '@angular/core';
import { FilterService } from '../../services/filter.service';

interface QuadrantCompany {
  name: string;
  founded: number;
  score: number;
  domain: string;
  type: 'Geniuses' | 'Gorillas' | 'Monkeys' | 'Dinosaurs';
}

@Component({
  selector: 'app-magic-quadrant',
  standalone: true,
  template: `
    <div class="flex flex-col h-[calc(100vh-64px)]">
      <!-- Visualization Content -->
      <div class="flex-1 p-8 overflow-y-auto">
        <div class="mx-auto max-w-6xl">
          <div class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold tracking-tighter uppercase flex items-center gap-2">
                <span class="material-symbols-outlined animate-pulse" [style.color]="domainColor()">radar</span>
                Magic Quadrant Matrix
              </h2>
              <p class="text-slate-500">
                Comparing company reputation vs. longevity for <span class="font-bold" [style.color]="domainColor()">{{ filterService.selectedDomain() }}</span>
                @if (comparisonDomain()) {
                  <span class="text-slate-400 mx-1">vs</span>
                  <span class="font-bold" [style.color]="getDomainColor(comparisonDomain()!)">{{ comparisonDomain() }}</span>
                }
              </p>
            </div>
            
            <!-- Comparison Control -->
            <div class="flex items-center gap-4">
              <div class="relative">
                <select 
                  class="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-2 pl-4 pr-8 rounded-lg cursor-pointer hover:border-[#0da6f2] focus:outline-none focus:ring-2 focus:ring-[#0da6f2]/20 transition-all"
                  (change)="setComparison($event)"
                >
                  <option value="">Compare Domain...</option>
                  @for (domain of availableComparisonDomains(); track domain) {
                    <option [value]="domain">{{ domain }}</option>
                  }
                </select>
                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">add_circle</span>
              </div>

              <div class="flex gap-4">
                <div class="flex items-center gap-2">
                  <span class="h-3 w-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" [style.backgroundColor]="domainColor()"></span>
                  <span class="text-xs font-medium text-slate-500">{{ filterService.selectedDomain() }}</span>
                </div>
                @if (comparisonDomain()) {
                  <div class="flex items-center gap-2">
                    <span class="h-3 w-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" [style.backgroundColor]="getDomainColor(comparisonDomain()!)"></span>
                    <span class="text-xs font-medium text-slate-500">{{ comparisonDomain() }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- The Matrix -->
          <div class="relative aspect-square md:aspect-video w-full rounded-2xl border border-slate-200 bg-white p-12 shadow-sm shadow-[0_0_30px_rgba(0,0,0,0.05)]" [style.borderColor]="domainColor() + '33'">
            <!-- Grid and Axes -->
            <div class="absolute inset-0 m-12 border-l-2 border-b-2 border-slate-300 relative" [style.backgroundImage]="'linear-gradient(to right, ' + domainColor() + '26 1px, transparent 1px), linear-gradient(to bottom, ' + domainColor() + '26 1px, transparent 1px)'" style="background-size: 40px 40px;">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-transparent animate-[scan_4s_linear_infinite] pointer-events-none" [style.backgroundImage]="'linear-gradient(to bottom, transparent, ' + domainColor() + '1A, transparent)'" style="height: 200%; top: -100%;"></div>
            </div>
            <!-- Axis Labels -->
            <div class="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-bold uppercase tracking-widest text-slate-400">Reputation Score (0-100)</div>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-widest text-slate-400">Foundation Year (1990 - 2024)</div>
            <!-- Quadrant Regions Background -->
            <div class="absolute inset-0 m-12 grid grid-cols-2 grid-rows-2 pointer-events-none">
              <div class="border-r border-b border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center">
                <span class="text-slate-400 text-3xl font-black opacity-20 uppercase tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Geniuses</span>
              </div>
              <div class="border-b border-dashed border-slate-200 flex flex-col items-center justify-center" [style.backgroundColor]="domainColor() + '0D'">
                <span class="text-3xl font-black opacity-20 uppercase tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" [style.color]="domainColor()">Gorillas</span>
              </div>
              <div class="border-r border-dashed border-slate-200 flex flex-col items-center justify-center" [style.backgroundColor]="domainColor() + '0D'">
                <span class="text-3xl font-black opacity-20 uppercase tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" [style.color]="domainColor()">Monkeys</span>
              </div>
              <div class="bg-slate-50/30 flex flex-col items-center justify-center">
                <span class="text-slate-400 text-3xl font-black opacity-20 uppercase tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Dinosaurs</span>
              </div>
            </div>
            <!-- Main Divide Lines -->
            <div class="absolute top-1/2 left-12 right-12 h-0.5 bg-slate-400/30"></div>
            <div class="absolute left-1/2 top-12 bottom-12 w-0.5 bg-slate-400/30"></div>
            
            <!-- Plotting Data Points -->
            <div class="relative h-full w-full">
              @for (company of filteredCompanies(); track company.name) {
                <div 
                  class="absolute group cursor-pointer" 
                  [style.left]="getXPosition(company.founded)"
                  [style.bottom]="getYPosition(company.score)"
                >
                  <div 
                    class="h-4 w-4 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.2)] transition-transform group-hover:scale-150 relative"
                    [style.backgroundColor]="getDomainColor(company.domain)"
                    [style.boxShadow]="'0 0 12px ' + getDomainColor(company.domain) + 'CC'"
                  >
                      <div class="absolute inset-0 rounded-full animate-[ping_2s_infinite]" [style.backgroundColor]="getDomainColor(company.domain) + '66'"></div>
                  </div>
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30">
                    <div class="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap border border-white/10">
                      <p class="font-bold">{{ company.name }}</p>
                      <p class="text-[10px] opacity-70">Founded: {{ company.founded }} | Score: {{ company.score }}</p>
                      <p class="text-[10px] font-bold uppercase mt-1" [style.color]="getDomainColor(company.domain)">{{ company.type }}</p>
                      <p class="text-[10px] opacity-50">{{ company.domain }}</p>
                    </div>
                  </div>
                </div>
              }
              
              @if (filteredCompanies().length === 0) {
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-lg text-center">
                    <p class="text-slate-500 font-medium">No data available for selected domains</p>
                  </div>
                </div>
              }
            </div>
          </div>
          
          <!-- Legend & Summary Cards (Only for primary domain to avoid clutter, or could aggregate) -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Geniuses</span>
                <span class="material-symbols-outlined text-sm" [style.color]="domainColor()">stars</span>
              </div>
              <div class="text-2xl font-bold">{{ getCount('Geniuses') }}</div>
              <p class="text-xs text-slate-500 mt-1">High Reputation, New Entrants</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Gorillas</span>
                <span class="material-symbols-outlined text-sm" [style.color]="domainColor()">rocket_launch</span>
              </div>
              <div class="text-2xl font-bold">{{ getCount('Gorillas') }}</div>
              <p class="text-xs text-slate-500 mt-1">Market Leaders, Established</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Monkeys</span>
                <span class="material-symbols-outlined text-sm" [style.color]="domainColor()">bolt</span>
              </div>
              <div class="text-2xl font-bold">{{ getCount('Monkeys') }}</div>
              <p class="text-xs text-slate-500 mt-1">Emerging Players, Low Score</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Dinosaurs</span>
                <span class="material-symbols-outlined text-sm" [style.color]="domainColor()">history</span>
              </div>
              <div class="text-2xl font-bold">{{ getCount('Dinosaurs') }}</div>
              <p class="text-xs text-slate-500 mt-1">Declining Leaders, Traditional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MagicQuadrantComponent {
  filterService = inject(FilterService);
  comparisonDomain = signal<string | null>(null);

  // Mock Data
  allCompanies: QuadrantCompany[] = [
    // Technology
    { name: 'NeuralEdge AI', founded: 2022, score: 95, domain: 'Technology', type: 'Geniuses' },
    { name: 'FinTech Giant Co.', founded: 1998, score: 92, domain: 'Technology', type: 'Gorillas' },
    { name: 'Alpha Systems', founded: 2005, score: 84, domain: 'Technology', type: 'Gorillas' },
    { name: 'SwiftPay', founded: 2023, score: 42, domain: 'Technology', type: 'Monkeys' },
    { name: 'Legacy Global Corp', founded: 1992, score: 28, domain: 'Technology', type: 'Dinosaurs' },
    { name: 'CloudNative', founded: 2020, score: 88, domain: 'Technology', type: 'Geniuses' },
    
    // Healthcare
    { name: 'MediTech Solutions', founded: 2018, score: 89, domain: 'Healthcare', type: 'Geniuses' },
    { name: 'PharmaOld', founded: 1995, score: 45, domain: 'Healthcare', type: 'Dinosaurs' },
    { name: 'HealthCare Plus', founded: 2000, score: 91, domain: 'Healthcare', type: 'Gorillas' },
    { name: 'BioStart', founded: 2023, score: 60, domain: 'Healthcare', type: 'Monkeys' },
    
    // Finance
    { name: 'BankCorp', founded: 1990, score: 85, domain: 'Finance', type: 'Gorillas' },
    { name: 'NeoBank', founded: 2021, score: 93, domain: 'Finance', type: 'Geniuses' },
    { name: 'OldMoney', founded: 1993, score: 30, domain: 'Finance', type: 'Dinosaurs' },
    { name: 'CryptoX', founded: 2022, score: 55, domain: 'Finance', type: 'Monkeys' },
    
    // Automotive
    { name: 'AutoDrive', founded: 2015, score: 88, domain: 'Automotive', type: 'Geniuses' },
    { name: 'CarMaker Inc', founded: 1994, score: 75, domain: 'Automotive', type: 'Gorillas' },
    { name: 'PartsCo', founded: 1991, score: 40, domain: 'Automotive', type: 'Dinosaurs' },
    
    // Retail
    { name: 'ShopifyLike', founded: 2019, score: 90, domain: 'Retail', type: 'Geniuses' },
    { name: 'MegaStore', founded: 1996, score: 82, domain: 'Retail', type: 'Gorillas' },
    { name: 'MallChain', founded: 1992, score: 35, domain: 'Retail', type: 'Dinosaurs' },
    
    // Manufacturing
    { name: 'RoboFactory', founded: 2020, score: 94, domain: 'Manufacturing', type: 'Geniuses' },
    { name: 'SteelWorks', founded: 1990, score: 60, domain: 'Manufacturing', type: 'Dinosaurs' },
    
    // Logistics
    { name: 'FastShip', founded: 2017, score: 87, domain: 'Logistics', type: 'Geniuses' },
    { name: 'CargoMove', founded: 1998, score: 78, domain: 'Logistics', type: 'Gorillas' },
    
    // Government
    { name: 'GovTech', founded: 2016, score: 85, domain: 'Government', type: 'Geniuses' },
    { name: 'DefenseCorp', founded: 1991, score: 90, domain: 'Government', type: 'Gorillas' },
  ];

  filteredCompanies = computed(() => {
    const primary = this.filterService.selectedDomain();
    const secondary = this.comparisonDomain();
    return this.allCompanies.filter(c => c.domain === primary || c.domain === secondary);
  });

  availableComparisonDomains = computed(() => {
    const primary = this.filterService.selectedDomain();
    // Get all unique domains from allCompanies, excluding the primary one
    const domains = Array.from(new Set(this.allCompanies.map(c => c.domain)));
    return domains.filter(d => d !== primary);
  });

  domainColor = computed(() => {
    return this.getDomainColor(this.filterService.selectedDomain());
  });

  getDomainColor(domain: string): string {
    switch (domain) {
      case 'Technology': return '#0da6f2'; // Blue
      case 'Healthcare': return '#ef4444'; // Red
      case 'Finance': return '#22c55e'; // Green
      case 'Retail': return '#f59e0b'; // Amber
      case 'Manufacturing': return '#6366f1'; // Indigo
      case 'Logistics': return '#ec4899'; // Pink
      case 'Government': return '#64748b'; // Slate
      case 'Automotive': return '#f97316'; // Orange
      default: return '#0da6f2';
    }
  }

  getCount(type: string): number {
    return this.filteredCompanies().filter(c => c.type === type).length;
  }

  getXPosition(year: number): string {
    // Map year 1990-2024 to 0-100%
    const minYear = 1990;
    const maxYear = 2024;
    const percentage = ((year - minYear) / (maxYear - minYear)) * 100;
    return Math.max(5, Math.min(95, percentage)) + '%'; // Clamp between 5% and 95%
  }

  getYPosition(score: number): string {
    // Map score 0-100 to 0-100%
    return Math.max(5, Math.min(95, score)) + '%'; // Clamp between 5% and 95%
  }

  setComparison(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.comparisonDomain.set(value || null);
  }

  clearFilters() {
    alert('Filters cleared!');
  }
}
