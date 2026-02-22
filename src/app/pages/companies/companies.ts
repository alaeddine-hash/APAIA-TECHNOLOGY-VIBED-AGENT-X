import { Component, computed, inject, signal } from '@angular/core';
import { FilterService } from '../../services/filter.service';

interface Company {
  name: string;
  companyName: string;
  score: number;
  size: string;
  founded: number;
  hq: string;
  domain: string;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  template: `
    <div class="flex flex-col h-[calc(100vh-64px)]">
      <!-- Gradient Header -->
      <header class="bg-gradient-to-br from-[#0da6f2] via-[#17a2b8] to-[#26c6da] px-8 py-12 shadow-xl relative z-10 border-b border-white/10 animate-[gradient-shift_15s_ease_infinite] bg-[length:400%_400%]">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 class="text-3xl font-bold text-white tracking-tight">Company Intelligence Profiles</h2>
            <p class="text-white/80 mt-1 font-medium">Manage and evaluate vendors in <span class="font-bold text-white underline decoration-white/30 underline-offset-4">{{ filterService.selectedDomain() }}</span>.</p>
          </div>
          <div class="flex gap-3">
            <button class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm border border-white/30 transition-all cursor-pointer" (click)="exportPDF('summary')">
              <span class="material-symbols-outlined text-lg">description</span>
              Export Summary PDF
            </button>
            <button class="bg-white text-[#17a2b8] hover:bg-white/95 px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm shadow-md transition-all cursor-pointer" (click)="exportPDF('detailed')">
              <span class="material-symbols-outlined text-lg">download</span>
              Export Detailed PDF
            </button>
          </div>
        </div>
      </header>
      <!-- Table Section -->
      <section class="flex-1 overflow-auto bg-white p-6">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-200">
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Product Name</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Final AI Score</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Links</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Company Size</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Foundation</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Headquarters</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (company of paginatedCompanies(); track company.name) {
                  <tr class="hover:bg-[#0da6f2]/5 transition-colors relative overflow-hidden group">
                    <td class="px-6 py-5 font-bold text-slate-800">{{ company.name }}</td>
                    <td class="px-6 py-5">{{ company.companyName }}</td>
                    <td class="px-6 py-5">
                      <div class="flex items-center gap-2">
                        <span class="px-3 py-1 bg-[#0da6f2]/10 text-[#0da6f2] font-bold text-sm rounded-full shadow-[0_0_12px_rgba(13,166,242,0.3)]">{{ company.score }}/100</span>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <div class="flex gap-2 text-slate-400">
                        <a class="hover:text-[#0da6f2] transition-colors cursor-pointer"><span class="material-symbols-outlined">link</span></a>
                        <a class="hover:text-[#0da6f2] transition-colors cursor-pointer"><span class="material-symbols-outlined">public</span></a>
                      </div>
                    </td>
                    <td class="px-6 py-5 text-sm">{{ company.size }}</td>
                    <td class="px-6 py-5 text-sm text-center">{{ company.founded }}</td>
                    <td class="px-6 py-5 text-sm">{{ company.hq }}</td>
                  </tr>
                }
                @if (paginatedCompanies().length === 0) {
                  <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                      No companies found for domain "{{ filterService.selectedDomain() }}".
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <!-- Pagination -->
        <div class="flex items-center justify-between py-6 px-2">
          <p class="text-sm text-slate-500 font-medium">
            Showing {{ (currentPage() - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage() * itemsPerPage, filteredCompanies().length) }} of {{ filteredCompanies().length }} results
          </p>
          <div class="flex items-center gap-2">
            <button 
              class="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="currentPage() === 1"
              (click)="setPage(currentPage() - 1)"
            >
              <span class="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            
            @for (page of visiblePages(); track page) {
              <button 
                class="size-9 flex items-center justify-center rounded-lg font-bold text-sm transition-all"
                [class.bg-[#0da6f2]]="currentPage() === page"
                [class.text-white]="currentPage() === page"
                [class.shadow-sm]="currentPage() === page"
                [class.border]="currentPage() !== page"
                [class.border-transparent]="currentPage() !== page"
                [class.text-slate-600]="currentPage() !== page"
                [class.hover:border-slate-200]="currentPage() !== page"
                (click)="setPage(page)"
              >
                {{ page }}
              </button>
            }

            <button 
              class="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="currentPage() === totalPages()"
              (click)="setPage(currentPage() + 1)"
            >
              <span class="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  `
})
export class CompaniesComponent {
  filterService = inject(FilterService);
  Math = Math;

  // Mock Data
  allCompanies: Company[] = [
    // Technology
    { name: 'Nexus AI', companyName: 'Synthetix Corp', score: 94, size: '501-1000', founded: 2021, hq: 'San Francisco, USA', domain: 'Technology' },
    { name: 'GenFlow', companyName: 'Neural Dynamics', score: 88, size: '201-500', founded: 2019, hq: 'London, UK', domain: 'Technology' },
    { name: 'Visionary', companyName: 'Optic Mind', score: 91, size: '51-200', founded: 2022, hq: 'Berlin, Germany', domain: 'Technology' },
    { name: 'DataWeave', companyName: 'Inference Labs', score: 85, size: '1001-5000', founded: 2018, hq: 'Toronto, Canada', domain: 'Technology' },
    { name: 'ChatSphere', companyName: 'Linguist AI', score: 92, size: '11-50', founded: 2023, hq: 'Austin, USA', domain: 'Technology' },
    { name: 'InsightCore', companyName: 'Cognitive Systems', score: 79, size: '5000+', founded: 2015, hq: 'Seattle, USA', domain: 'Technology' },
    { name: 'CodeGenie', companyName: 'DevAssist Inc', score: 89, size: '51-200', founded: 2020, hq: 'Tel Aviv, Israel', domain: 'Technology' },
    { name: 'CloudScale', companyName: 'InfraOps', score: 87, size: '201-500', founded: 2017, hq: 'New York, USA', domain: 'Technology' },
    
    // Healthcare
    { name: 'MediScan', companyName: 'HealthAI Solutions', score: 95, size: '201-500', founded: 2018, hq: 'Boston, USA', domain: 'Healthcare' },
    { name: 'BioPredict', companyName: 'Genomics Inc', score: 91, size: '51-200', founded: 2020, hq: 'Cambridge, UK', domain: 'Healthcare' },
    { name: 'CareBot', companyName: 'PatientFirst', score: 84, size: '11-50', founded: 2022, hq: 'Stockholm, Sweden', domain: 'Healthcare' },
    { name: 'PharmaMind', companyName: 'DrugDiscovery Co', score: 93, size: '501-1000', founded: 2016, hq: 'Basel, Switzerland', domain: 'Healthcare' },
    
    // Finance
    { name: 'FinSense', companyName: 'Capital AI', score: 96, size: '1001-5000', founded: 2015, hq: 'New York, USA', domain: 'Finance' },
    { name: 'RiskGuard', companyName: 'SecureTrade', score: 89, size: '201-500', founded: 2019, hq: 'Singapore', domain: 'Finance' },
    { name: 'AlgoTrade', companyName: 'QuantMetrics', score: 92, size: '51-200', founded: 2021, hq: 'Chicago, USA', domain: 'Finance' },
    
    // Automotive
    { name: 'AutoPilot', companyName: 'DriveSafe', score: 90, size: '5000+', founded: 2014, hq: 'Detroit, USA', domain: 'Automotive' },
    { name: 'EV-Optimize', companyName: 'BatteryTech', score: 86, size: '201-500', founded: 2018, hq: 'Munich, Germany', domain: 'Automotive' },
    
    // Retail
    { name: 'ShopSmart', companyName: 'RetailAI', score: 88, size: '501-1000', founded: 2017, hq: 'Paris, France', domain: 'Retail' },
    { name: 'InventoryPro', companyName: 'SupplyChainz', score: 85, size: '51-200', founded: 2020, hq: 'Tokyo, Japan', domain: 'Retail' },
    
    // Manufacturing
    { name: 'FactoryMind', companyName: 'Industrial IoT', score: 91, size: '1001-5000', founded: 2016, hq: 'Seoul, South Korea', domain: 'Manufacturing' },
    { name: 'QualityCheck', companyName: 'PrecisionAI', score: 87, size: '201-500', founded: 2019, hq: 'Shenzhen, China', domain: 'Manufacturing' },
    
    // Logistics
    { name: 'RouteOpt', companyName: 'LogiTech', score: 93, size: '501-1000', founded: 2015, hq: 'Hamburg, Germany', domain: 'Logistics' },
    { name: 'FleetTrack', companyName: 'GlobalMove', score: 86, size: '201-500', founded: 2018, hq: 'Rotterdam, Netherlands', domain: 'Logistics' },
    
    // Government
    { name: 'CivicAI', companyName: 'GovTech Solutions', score: 89, size: '501-1000', founded: 2017, hq: 'Washington DC, USA', domain: 'Government' },
    { name: 'SecureNet', companyName: 'DefenseSystems', score: 94, size: '5000+', founded: 2010, hq: 'Canberra, Australia', domain: 'Government' },
  ];

  currentPage = signal(1);
  itemsPerPage = 6;

  filteredCompanies = computed(() => {
    const domain = this.filterService.selectedDomain();
    return this.allCompanies.filter(c => c.domain === domain);
  });

  paginatedCompanies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredCompanies().slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() => Math.ceil(this.filteredCompanies().length / this.itemsPerPage));

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        for (let i = current - 2; i <= current + 2; i++) pages.push(i);
      }
    }
    return pages;
  });

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  exportPDF(type: string) {
    const content = this.filteredCompanies().map(c => `${c.name} - ${c.companyName} (${c.score})`).join('\n');
    const blob = new Blob([`EXPORT TYPE: ${type.toUpperCase()}\nDOMAIN: ${this.filterService.selectedDomain()}\n\n${content}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies_${type}_${this.filterService.selectedDomain().toLowerCase()}.txt`; // Simulating PDF with TXT for simplicity in this environment
    a.click();
    window.URL.revokeObjectURL(url);
    alert(`Exported ${type} report for ${this.filterService.selectedDomain()}`);
  }
}
