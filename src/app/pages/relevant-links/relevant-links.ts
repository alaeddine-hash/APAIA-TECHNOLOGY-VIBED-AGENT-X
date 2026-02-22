import { Component, computed, inject, signal } from '@angular/core';
import { FilterService } from '../../services/filter.service';

interface Link {
  title: string;
  url: string;
  source: string;
  relevance: number;
  date: string;
  tags: string[];
  domain: string;
}

@Component({
  selector: 'app-relevant-links',
  standalone: true,
  template: `
    <div class="flex flex-col h-[calc(100vh-64px)]">
      <!-- Header -->
      <header class="bg-slate-900 text-white px-8 py-12 relative overflow-hidden shadow-lg z-10">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0da6f2_0%,transparent_40%)] opacity-20"></div>
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#0da6f2_1px,transparent_1px),linear-gradient(to_bottom,#0da6f2_1px,transparent_1px)] bg-[length:40px_40px] opacity-[0.03]"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded bg-[#0da6f2]/20 text-[#0da6f2] text-[10px] font-bold uppercase tracking-widest border border-[#0da6f2]/20">Knowledge Graph</span>
            </div>
            <h2 class="text-3xl font-bold tracking-tight text-white">Source Verification & Links</h2>
            <p class="text-slate-400 mt-2 max-w-xl">Traceable intelligence sources for <span class="text-[#0da6f2] font-bold">{{ filterService.selectedDomain() }}</span> with relevance scoring.</p>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="text-right hidden md:block">
              <div class="text-2xl font-bold text-[#0da6f2]">{{ filteredLinks().length }}</div>
              <div class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Verified Sources</div>
            </div>
            <div class="h-10 w-px bg-white/10 hidden md:block"></div>
            <div class="text-right hidden md:block">
              <div class="text-2xl font-bold text-green-400">98.2%</div>
              <div class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Uptime</div>
            </div>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-hidden flex flex-col bg-slate-50">
        <!-- Toolbar -->
        <div class="px-8 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 w-full md:w-auto">
            <div class="relative flex-1 md:w-80">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input type="text" placeholder="Search domains, titles, or tags..." class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0da6f2] focus:ring-1 focus:ring-[#0da6f2] transition-all">
            </div>
            <button class="p-2 text-slate-500 hover:text-[#0da6f2] hover:bg-[#0da6f2]/5 rounded-lg border border-slate-200 transition-colors">
              <span class="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Sort by:</span>
            <select class="text-sm bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer">
              <option>Relevance Score</option>
              <option>Date Added</option>
              <option>Domain Authority</option>
            </select>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-auto p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main List -->
            <div class="lg:col-span-2 space-y-4">
              @for (link of paginatedLinks(); track link.title) {
                <div class="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-[#0da6f2]/30 transition-all group cursor-pointer relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-1 h-full" [class.bg-[#0da6f2]]="link.relevance >= 9" [class.bg-green-500]="link.relevance >= 8 && link.relevance < 9" [class.bg-amber-500]="link.relevance < 8"></div>
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <span class="material-symbols-outlined text-slate-400">public</span>
                      </div>
                      <div>
                        <h3 class="font-bold text-slate-900 group-hover:text-[#0da6f2] transition-colors">{{ link.title }}</h3>
                        <div class="flex items-center gap-2 text-xs text-slate-500">
                          <span class="font-medium text-slate-700">{{ link.source }}</span>
                          <span>•</span>
                          <span>{{ link.date }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="text-lg font-bold" [class.text-[#0da6f2]]="link.relevance >= 9" [class.text-green-500]="link.relevance >= 8 && link.relevance < 9" [class.text-amber-500]="link.relevance < 8">{{ link.relevance }}</span>
                      <span class="text-[10px] uppercase font-bold text-slate-400">Relevance</span>
                    </div>
                  </div>
                  <p class="text-sm text-slate-600 line-clamp-2 mb-4">{{ link.url }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex gap-2">
                      @for (tag of link.tags; track tag) {
                        <span class="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{{ tag }}</span>
                      }
                    </div>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button class="p-1.5 text-slate-400 hover:text-[#0da6f2] transition-colors" title="Open Link">
                        <span class="material-symbols-outlined text-lg">open_in_new</span>
                      </button>
                      <button class="p-1.5 text-slate-400 hover:text-[#0da6f2] transition-colors" title="Copy URL">
                        <span class="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              }
              
              @if (paginatedLinks().length === 0) {
                <div class="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                  No links found for domain "{{ filterService.selectedDomain() }}".
                </div>
              }

              <!-- Pagination -->
              <div class="pt-4 flex items-center justify-center">
                <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <button 
                    class="p-1 text-slate-400 hover:text-[#0da6f2] disabled:opacity-30" 
                    [disabled]="currentPage() === 1"
                    (click)="setPage(currentPage() - 1)"
                  >
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                  <span class="text-xs font-bold text-slate-600">Page {{ currentPage() }} of {{ totalPages() }}</span>
                  <button 
                    class="p-1 text-slate-400 hover:text-[#0da6f2] disabled:opacity-30"
                    [disabled]="currentPage() === totalPages()"
                    (click)="setPage(currentPage() + 1)"
                  >
                    <span class="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Sidebar Stats -->
            <div class="space-y-6">
              <!-- Stats Card -->
              <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Domain Distribution</h3>
                <div class="space-y-4">
                  <div>
                    <div class="flex justify-between text-xs font-medium mb-1">
                      <span>Academic (.edu)</span>
                      <span class="text-slate-500">45%</span>
                    </div>
                    <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-[#0da6f2] w-[45%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs font-medium mb-1">
                      <span>Government (.gov)</span>
                      <span class="text-slate-500">30%</span>
                    </div>
                    <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-green-500 w-[30%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs font-medium mb-1">
                      <span>Commercial (.com)</span>
                      <span class="text-slate-500">25%</span>
                    </div>
                    <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-500 w-[25%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Filters -->
              <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top Tags</h3>
                <div class="flex flex-wrap gap-2">
                  <button class="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:border-[#0da6f2] hover:text-[#0da6f2] transition-colors">Climate Change</button>
                  <button class="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:border-[#0da6f2] hover:text-[#0da6f2] transition-colors">AI Research</button>
                  <button class="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:border-[#0da6f2] hover:text-[#0da6f2] transition-colors">Market Data</button>
                  <button class="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:border-[#0da6f2] hover:text-[#0da6f2] transition-colors">Regulatory</button>
                  <button class="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:border-[#0da6f2] hover:text-[#0da6f2] transition-colors">Tech</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RelevantLinksComponent {
  filterService = inject(FilterService);
  Math = Math;

  allLinks: Link[] = [
    // Technology
    { title: 'AI Data Labeling Trends 2024', url: 'techcrunch.com/ai-labeling', source: 'techcrunch.com', relevance: 9.8, date: '2 days ago', tags: ['AI', 'Data'], domain: 'Technology' },
    { title: 'Cloud Migration Strategies', url: 'aws.amazon.com/whitepapers', source: 'aws.amazon.com', relevance: 9.5, date: '1 week ago', tags: ['Cloud', 'AWS'], domain: 'Technology' },
    { title: 'Cybersecurity Audit Frameworks', url: 'nist.gov/cyberframework', source: 'nist.gov', relevance: 9.9, date: '3 days ago', tags: ['Security', 'Gov'], domain: 'Technology' },
    { title: 'The Future of ERP', url: 'gartner.com/erp-trends', source: 'gartner.com', relevance: 9.2, date: '1 month ago', tags: ['ERP', 'Enterprise'], domain: 'Technology' },
    { title: 'Machine Learning Ops Guide', url: 'oreilly.com/mlops', source: 'oreilly.com', relevance: 8.8, date: '5 days ago', tags: ['ML', 'DevOps'], domain: 'Technology' },
    
    // Healthcare
    { title: 'Genomics Data Standards', url: 'nih.gov/genomics', source: 'nih.gov', relevance: 9.7, date: '1 day ago', tags: ['Genomics', 'Data'], domain: 'Healthcare' },
    { title: 'Telehealth Regulations 2024', url: 'hhs.gov/telehealth', source: 'hhs.gov', relevance: 9.4, date: '2 weeks ago', tags: ['Telehealth', 'Regs'], domain: 'Healthcare' },
    { title: 'AI in Drug Discovery', url: 'nature.com/articles/ai-drug', source: 'nature.com', relevance: 9.6, date: '3 days ago', tags: ['AI', 'Pharma'], domain: 'Healthcare' },
    
    // Finance
    { title: 'Global Fintech Report', url: 'bloomberg.com/fintech', source: 'bloomberg.com', relevance: 9.3, date: '4 days ago', tags: ['Fintech', 'Market'], domain: 'Finance' },
    { title: 'Crypto Regulation Update', url: 'sec.gov/crypto', source: 'sec.gov', relevance: 9.8, date: '1 week ago', tags: ['Crypto', 'Gov'], domain: 'Finance' },
    { title: 'Banking API Standards', url: 'openbanking.org.uk', source: 'openbanking.org.uk', relevance: 9.1, date: '2 weeks ago', tags: ['API', 'Banking'], domain: 'Finance' },
    
    // Automotive
    { title: 'EV Battery Tech Breakthroughs', url: 'sae.org/ev-battery', source: 'sae.org', relevance: 9.5, date: '3 days ago', tags: ['EV', 'Tech'], domain: 'Automotive' },
    { title: 'Autonomous Driving Levels Explained', url: 'nhtsa.gov/automated-vehicles', source: 'nhtsa.gov', relevance: 9.9, date: '1 month ago', tags: ['Auto', 'AI'], domain: 'Automotive' },
    
    // Retail
    { title: 'E-commerce Trends 2025', url: 'shopify.com/enterprise', source: 'shopify.com', relevance: 9.0, date: '1 week ago', tags: ['Retail', 'Trends'], domain: 'Retail' },
    { title: 'Supply Chain Resilience', url: 'hbr.org/supply-chain', source: 'hbr.org', relevance: 9.4, date: '2 days ago', tags: ['Supply Chain', 'Biz'], domain: 'Retail' },
    
    // Manufacturing
    { title: 'Industry 4.0 Implementation', url: 'siemens.com/industry-4-0', source: 'siemens.com', relevance: 9.2, date: '3 weeks ago', tags: ['IoT', 'Mfg'], domain: 'Manufacturing' },
    { title: 'Sustainable Manufacturing', url: 'epa.gov/sustainability', source: 'epa.gov', relevance: 9.6, date: '1 month ago', tags: ['Green', 'Gov'], domain: 'Manufacturing' },
    
    // Government
    { title: 'Digital Government Strategy', url: 'whitehouse.gov/digital', source: 'whitehouse.gov', relevance: 9.8, date: '2 days ago', tags: ['Gov', 'Strategy'], domain: 'Government' },
    { title: 'Public Sector AI Ethics', url: 'weforum.org/ai-ethics', source: 'weforum.org', relevance: 9.3, date: '1 week ago', tags: ['AI', 'Ethics'], domain: 'Government' },
  ];

  currentPage = signal(1);
  itemsPerPage = 3;

  filteredLinks = computed(() => {
    const domain = this.filterService.selectedDomain();
    return this.allLinks.filter(l => l.domain === domain);
  });

  paginatedLinks = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredLinks().slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() => Math.ceil(this.filteredLinks().length / this.itemsPerPage));

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
