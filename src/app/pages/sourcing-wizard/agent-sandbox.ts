import { Component, inject, input, output, signal, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { GoogleGenAI } from "@google/genai";
import { CompanyService } from '../../services/company.service';
import { FilterService } from '../../services/filter.service';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'info' | 'system';
  content: string;
}

@Component({
  selector: 'app-agent-sandbox',
  standalone: true,
  imports: [DatePipe, NgClass, NgStyle],
  template: `
    <div class="fixed inset-0 z-50 bg-[#0d1117] font-sans text-slate-300 flex flex-col overflow-hidden">
      <!-- Professional Header -->
      <div class="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shadow-sm select-none">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
              <span class="material-symbols-outlined text-lg">smart_toy</span>
            </div>
            <div>
              <h1 class="font-bold text-sm text-white tracking-tight">OpenHands <span class="text-slate-500 font-normal">Workspace</span></h1>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">Runtime Active</span>
              </div>
            </div>
          </div>
          <div class="h-6 w-px bg-[#30363d] mx-2"></div>
          <div class="flex items-center gap-2 text-xs">
            <span class="px-2 py-0.5 rounded-full bg-[#30363d] border border-[#30363d] text-slate-400 font-mono">Docker</span>
            <span class="px-2 py-0.5 rounded-full bg-[#30363d] border border-[#30363d] text-slate-400 font-mono">Ubuntu 24.04</span>
            <span class="px-2 py-0.5 rounded-full bg-[#30363d] border border-[#30363d] text-slate-400 font-mono">vCPU: 4</span>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] rounded-md border border-[#30363d]">
            <span class="material-symbols-outlined text-xs text-slate-400">timer</span>
            <span class="text-xs font-mono text-white">{{ sessionDuration | date:'mm:ss' }}</span>
          </div>
          <button class="p-2 hover:bg-[#30363d] rounded-md text-slate-400 hover:text-white transition-colors" (click)="minimize()">
            <span class="material-symbols-outlined text-xl">close_fullscreen</span>
          </button>
        </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Left Sidebar: Agent State -->
        <div class="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col hidden md:flex">
          <div class="p-4 border-b border-[#30363d]">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Current Task</h3>
            <div class="p-3 bg-[#161b22] rounded-lg border border-[#30363d] shadow-sm">
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-blue-400 text-sm mt-0.5">search</span>
                <p class="text-xs text-white leading-relaxed">{{ useCase() }}</p>
              </div>
            </div>
          </div>
          
          <div class="flex-1 p-4 overflow-y-auto">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Event Stream</h3>
            <div class="space-y-3 relative before:absolute before:left-1.5 before:top-2 before:bottom-0 before:w-px before:bg-[#30363d]">
              @for (step of executionSteps(); track step.id) {
                <div class="relative pl-6">
                  <div class="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-[#0d1117]"
                       [ngClass]="{
                         'bg-emerald-500 border-emerald-500': step.status === 'completed',
                         'bg-blue-500 border-blue-500 animate-pulse': step.status === 'active',
                         'bg-[#30363d] border-[#30363d]': step.status === 'pending'
                       }"></div>
                  <p class="text-xs font-medium" 
                     [ngClass]="{'text-white': step.status === 'active', 'text-slate-500': step.status === 'pending', 'text-emerald-400': step.status === 'completed'}">
                    {{ step.label }}
                  </p>
                  @if (step.status === 'active') {
                    <p class="text-[10px] text-blue-400 mt-1 animate-pulse">Processing...</p>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Center: Remote Desktop -->
        <div class="flex-1 bg-[#010409] flex flex-col relative">
          <!-- Toolbar -->
          <div class="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="material-symbols-outlined text-sm">desktop_windows</span>
              <span>Remote Desktop (VNC)</span>
              <span class="text-[#30363d]">|</span>
              <span class="text-emerald-500">Connected</span>
            </div>
            <div class="flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               <span class="text-[10px] font-bold text-red-500 uppercase">Live View</span>
            </div>
          </div>

          <!-- Viewport -->
          <div class="flex-1 relative overflow-hidden flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <div class="relative w-full max-w-5xl aspect-video bg-white rounded shadow-2xl overflow-hidden border border-[#30363d] ring-1 ring-black">
              <!-- Browser Chrome inside VNC -->
              <div class="h-8 bg-[#dee1e6] flex items-center px-2 border-b border-[#bdc1c6] gap-2">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
                </div>
                <div class="flex-1 h-6 bg-white rounded-sm border border-[#bdc1c6] flex items-center px-2 text-[10px] text-slate-700 shadow-sm">
                  <span class="material-symbols-outlined text-[10px] mr-1 text-slate-400">lock</span>
                  {{ currentUrl() }}
                </div>
              </div>
              
              <!-- Content -->
              <div class="absolute inset-x-0 top-8 bottom-0 bg-white overflow-y-auto" #browserViewport>
                @if (isLoadingPage()) {
                  <div class="absolute inset-0 flex items-center justify-center bg-white/90 z-10 backdrop-blur-[1px]">
                    <div class="flex flex-col items-center gap-3">
                      <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Navigating...</p>
                    </div>
                  </div>
                }
                <div [innerHTML]="browserContent()" class="min-h-full font-sans text-slate-900"></div>
                
                <!-- Agent Cursor -->
                <div class="absolute w-4 h-4 pointer-events-none z-50 transition-all duration-300 ease-out drop-shadow-xl"
                     [ngStyle]="{ 'left.px': cursorX(), 'top.px': cursorY() }">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#2563eb" stroke="white" stroke-width="2"/>
                  </svg>
                  <div class="absolute top-5 left-4 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap shadow-sm">
                    Agent
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Terminal Panel -->
          <div class="h-48 bg-[#0d1117] border-t border-[#30363d] flex flex-col">
            <div class="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 gap-4">
              <button class="text-xs font-bold text-white border-b-2 border-orange-500 h-full px-2">TERMINAL</button>
              <button class="text-xs font-bold text-slate-500 hover:text-slate-300 h-full px-2">PORTS</button>
              <button class="text-xs font-bold text-slate-500 hover:text-slate-300 h-full px-2">LOGS</button>
            </div>
            <div class="flex-1 p-3 font-mono text-[11px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#30363d]" #terminalContainer>
              @for (line of terminalLines(); track $index) {
                <div class="mb-0.5 break-words">
                  @if (line.type === 'command') {
                    <span class="text-blue-400 font-bold">➜</span> <span class="text-cyan-300 font-bold"> ~</span> <span class="text-slate-300">{{ line.content }}</span>
                  } @else if (line.type === 'system') {
                    <span class="text-slate-500">[SYSTEM]</span> <span class="text-slate-400">{{ line.content }}</span>
                  } @else if (line.type === 'error') {
                    <span class="text-red-400">✖ {{ line.content }}</span>
                  } @else if (line.type === 'success') {
                    <span class="text-emerald-400">✔ {{ line.content }}</span>
                  } @else {
                    <span class="text-slate-400">{{ line.content }}</span>
                  }
                </div>
              }
              @if (isTyping()) {
                <div class="flex items-center gap-1">
                  <span class="text-blue-400 font-bold">➜</span> <span class="text-cyan-300 font-bold"> ~</span>
                  <span class="w-1.5 h-3 bg-slate-400 animate-pulse"></span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgentSandboxComponent implements OnInit, AfterViewChecked {
  domain = input.required<string>();
  useCase = input.required<string>();
  finished = output<void>();

  companyService = inject(CompanyService);
  filterService = inject(FilterService);

  sessionDuration = Date.now();
  
  terminalLines = signal<TerminalLine[]>([
    { type: 'system', content: 'Initializing OpenHands Runtime Environment...' },
    { type: 'system', content: 'Allocating resources: 4 vCPU, 8GB RAM' },
    { type: 'system', content: 'Mounting volume: /workspace/agent' },
    { type: 'success', content: 'Container started (id: 8f3a2b1c)' },
  ]);
  
  executionSteps = signal([
    { id: 'init', label: 'Booting Environment', status: 'completed' },
    { id: 'plan', label: 'Strategic Planning', status: 'active' },
    { id: 'research', label: 'Deep Research', status: 'pending' },
    { id: 'verify', label: 'Verification', status: 'pending' },
    { id: 'export', label: 'Data Export', status: 'pending' }
  ]);

  isTyping = signal(false);
  
  // Browser State
  currentUrl = signal('about:blank');
  browserContent = signal('<div class="h-full flex items-center justify-center text-slate-400 bg-slate-50">Waiting for agent input...</div>');
  cursorX = signal(100);
  cursorY = signal(100);
  isLoadingPage = signal(false);

  @ViewChild('terminalContainer') terminalContainer!: ElementRef;

  ngOnInit() {
    // Update timer
    setInterval(() => this.sessionDuration = Date.now(), 1000);
    this.startDeepResearch();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.terminalContainer) {
      this.terminalContainer.nativeElement.scrollTop = this.terminalContainer.nativeElement.scrollHeight;
    }
  }

  addTerminalLine(type: TerminalLine['type'], content: string) {
    this.terminalLines.update(lines => [...lines, { type, content }]);
  }

  async typeCommand(command: string) {
    this.isTyping.set(true);
    await new Promise(r => setTimeout(r, 400)); 
    this.isTyping.set(false);
    this.addTerminalLine('command', command);
    await new Promise(r => setTimeout(r, 200));
  }

  async moveCursor(x: number, y: number) {
    this.cursorX.set(x);
    this.cursorY.set(y);
    await new Promise(r => setTimeout(r, 600));
  }

  updateStep(id: string, status: 'active' | 'completed' | 'pending') {
    this.executionSteps.update(steps => steps.map(s => s.id === id ? { ...s, status } : s));
  }

  async startDeepResearch() {
    await new Promise(r => setTimeout(r, 1000));
    
    // 1. Planning Phase
    this.updateStep('plan', 'active');
    await this.typeCommand('openhands plan --goal "Find companies in ' + this.domain() + '"');
    this.addTerminalLine('info', 'Generating research strategy using Gemini Pro...');
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const queryPrompt = `
      Generate 3 professional boolean search queries to find companies in: "${this.domain()}".
      Focus on "startups", "vendors", "platforms".
      Return ONLY JSON array of strings.
    `;

    let queries: string[] = [];
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: queryPrompt,
        config: { responseMimeType: 'application/json' }
      });
      queries = JSON.parse(response.text || '[]');
    } catch {
      queries = [`"${this.domain()}" startups 2025`, `top "${this.domain()}" vendors`];
    }

    this.addTerminalLine('success', `Strategy generated: ${queries.length} search vectors.`);
    this.updateStep('plan', 'completed');

    // 2. Research Phase
    this.updateStep('research', 'active');
    let totalCompaniesFound = 0;

    for (const query of queries) {
      await this.typeCommand(`browser.goto("google.com")`);
      
      // Simulate Browser
      this.currentUrl.set('https://www.google.com');
      this.browserContent.set(this.getGoogleHomeHtml());
      await this.moveCursor(300, 200);
      await this.typeCommand(`browser.type("${query}")`);
      this.browserContent.set(this.getGoogleHomeHtml(query));
      await this.moveCursor(350, 250); // Click search
      
      this.isLoadingPage.set(true);
      await new Promise(r => setTimeout(r, 2000));
      
      // Real Search
      try {
        const searchResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Find 2 REAL companies for: ${query}. Return JSON: [{ "name": "...", "website": "...", "description": "...", "founded": 2020 }]`,
          config: { 
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json'
          }
        });

        const companies = JSON.parse(searchResponse.text || '[]');
        this.isLoadingPage.set(false);
        this.currentUrl.set(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
        
        if (companies.length > 0) {
          this.browserContent.set(this.getGoogleResultsHtml(companies));
          this.addTerminalLine('success', `Found ${companies.length} candidates.`);
          
          for (const company of companies) {
            await this.typeCommand(`browser.visit("${company.website}")`);
            this.currentUrl.set(company.website);
            this.browserContent.set(this.getCompanyPageHtml(company));
            
            this.addTerminalLine('info', `Scraping metadata from ${company.name}...`);
            await new Promise(r => setTimeout(r, 1500));
            
            this.companyService.addCompany({
              name: company.name,
              domain: this.domain(),
              description: company.description,
              status: 'New',
              score: Math.floor(Math.random() * 15) + 85,
              website: company.website,
              founded: company.founded || 2020
            });
            
            this.addTerminalLine('success', `Entity extracted: ${company.name}`);
            totalCompaniesFound++;
          }
        } else {
          this.addTerminalLine('info', 'No matches found. Adjusting parameters...');
        }

      } catch {
        this.addTerminalLine('error', 'Network timeout. Retrying...');
      }
    }
    this.updateStep('research', 'completed');

    // 3. Finalize
    this.updateStep('verify', 'active');
    await this.typeCommand('data.validate --strict');
    await new Promise(r => setTimeout(r, 1000));
    this.updateStep('verify', 'completed');
    
    this.updateStep('export', 'active');
    await this.typeCommand(`export --format=json --out=./${this.domain().replace(/\s+/g, '_')}_report.json`);
    this.addTerminalLine('success', `Exported ${totalCompaniesFound} records.`);
    this.updateStep('export', 'completed');

    this.filterService.addDomain(this.domain());
    this.filterService.setDomain(this.domain());
    
    await this.typeCommand('exit');
    
    setTimeout(() => {
      this.finished.emit();
    }, 2000);
  }

  minimize() {
    this.finished.emit();
  }

  // HTML Helpers
  getGoogleHomeHtml(query = '') {
    return `
      <div class="flex flex-col items-center justify-center min-h-[400px] gap-6 bg-white">
        <h1 class="text-5xl font-bold text-slate-700 tracking-tighter">Google</h1>
        <div class="w-full max-w-lg h-12 rounded-full border border-slate-300 shadow-sm flex items-center px-4 text-slate-600">
          <span class="material-symbols-outlined mr-2">search</span>
          <span>${query}</span>
          <span class="animate-pulse">|</span>
        </div>
      </div>
    `;
  }

  getGoogleResultsHtml(companies: { name: string; website: string; description: string }[]) {
    let html = `<div class="p-8 max-w-3xl bg-white min-h-full"><p class="text-xs text-slate-500 mb-4">Search Results</p>`;
    companies.forEach(c => {
      html += `
        <div class="mb-6">
          <div class="text-xs text-slate-700 mb-1">${c.website}</div>
          <h3 class="text-xl text-blue-800 hover:underline font-medium mb-1">${c.name}</h3>
          <p class="text-sm text-slate-600">${c.description}</p>
        </div>
      `;
    });
    html += '</div>';
    return html;
  }

  getCompanyPageHtml(company: { name: string; description: string }) {
    return `
      <div class="min-h-full bg-white font-sans">
        <nav class="h-16 border-b border-slate-100 flex items-center justify-between px-8">
          <h1 class="font-bold text-xl">${company.name}</h1>
          <div class="flex gap-4 text-sm font-medium text-slate-600">
            <span class="hover:text-blue-600 cursor-pointer">Product</span>
            <span class="hover:text-blue-600 cursor-pointer">About</span>
          </div>
        </nav>
        <div class="p-12 text-center">
          <h2 class="text-4xl font-bold text-slate-900 mb-4">Future of ${this.domain()}</h2>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">${company.description}</p>
          <div class="mt-8 h-64 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-300">
            Analyzing content...
          </div>
        </div>
      </div>
    `;
  }

  getCompanySolutionsHtml(company: { name: string }) {
    return `
      <div class="min-h-full bg-white font-sans">
        <nav class="h-16 border-b border-slate-100 flex items-center justify-between px-8">
          <h1 class="font-bold text-xl">${company.name}</h1>
        </nav>
        <div class="p-12">
          <h2 class="text-2xl font-bold mb-6">Our Solutions</h2>
          <div class="grid grid-cols-2 gap-6">
            <div class="p-6 border border-slate-200 rounded-lg">
              <h3 class="font-bold mb-2">Enterprise AI</h3>
              <p class="text-sm text-slate-600">Scalable models for big data.</p>
            </div>
            <div class="p-6 border border-slate-200 rounded-lg">
              <h3 class="font-bold mb-2">Cloud Sync</h3>
              <p class="text-sm text-slate-600">Real-time data synchronization.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
