import { Component, inject, input, output, signal, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { FilterService } from '../../services/filter.service';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  content: string;
}

interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
}

@Component({
  selector: 'app-agent-sandbox',
  standalone: true,
  imports: [DatePipe, NgClass, NgStyle],
  template: `
    <div class="fixed inset-0 z-50 bg-[#2c001e] font-ubuntu overflow-hidden flex flex-col select-none">
      <!-- Ubuntu Top Bar -->
      <div class="h-7 bg-[#1e1e1e] flex items-center justify-between px-3 text-sm text-slate-300 shadow-md z-50">
        <div class="flex items-center gap-4">
          <span class="font-bold text-white">Activities</span>
          <span class="hover:text-white cursor-pointer transition-colors">Terminal</span>
          <span class="hover:text-white cursor-pointer transition-colors">Firefox Web Browser</span>
        </div>
        <div class="font-medium">{{ currentTime | date:'MMM d HH:mm' }}</div>
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-xs">wifi</span>
          <span class="material-symbols-outlined text-xs">volume_up</span>
          <span class="material-symbols-outlined text-xs">battery_full</span>
          <span class="material-symbols-outlined text-xs">arrow_drop_down</span>
        </div>
      </div>

      <!-- Desktop Area -->
      <div class="flex-1 relative bg-[url('https://design.ubuntu.com/wp-content/uploads/ubuntu-wallpaper-22-04-1.jpg')] bg-cover bg-center">
        <!-- Ubuntu Dock -->
        <div class="absolute left-0 top-0 bottom-0 w-14 bg-[#000000]/40 backdrop-blur-md flex flex-col items-center py-2 gap-2 z-40">
          <div class="w-10 h-10 rounded bg-orange-600 flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-orange-500 transition-colors relative">
            <span class="material-symbols-outlined">grid_view</span>
          </div>
          <div class="w-1 h-px bg-white/20 my-1 w-8"></div>
          <div class="w-10 h-10 rounded bg-[#3E3E3E] flex items-center justify-center text-white shadow-lg cursor-pointer relative group">
            <span class="material-symbols-outlined text-orange-500">terminal</span>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-1 h-1 bg-orange-500 rounded-full"></div>
          </div>
          <div class="w-10 h-10 rounded bg-[#3E3E3E] flex items-center justify-center text-white shadow-lg cursor-pointer relative group">
            <span class="material-symbols-outlined text-blue-400">public</span>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-1 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>

        <!-- Terminal Window -->
        <div class="absolute top-10 left-20 w-[600px] h-[400px] bg-[#300a24]/95 rounded-lg shadow-2xl flex flex-col border border-slate-700 overflow-hidden transition-all duration-300"
             [style.transform]="'translate(' + terminalPos.x + 'px, ' + terminalPos.y + 'px)'">
          <!-- Window Controls -->
          <div class="h-8 bg-[#3E3E3E] flex items-center justify-center relative border-b border-black/50 handle cursor-move">
            <span class="text-slate-300 text-xs font-bold">agent@ubuntu: ~/research</span>
            <div class="absolute right-2 flex gap-2">
              <div class="w-3 h-3 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-[8px] cursor-pointer hover:bg-orange-500 hover:text-white">_</div>
              <div class="w-3 h-3 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-[8px] cursor-pointer hover:bg-orange-500 hover:text-white">□</div>
              <div class="w-3 h-3 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px] cursor-pointer hover:bg-red-500">✕</div>
            </div>
          </div>
          <!-- Terminal Content -->
          <div class="flex-1 p-2 font-mono text-xs text-slate-200 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600" #terminalContainer>
            @for (line of terminalLines(); track $index) {
              <div class="break-words leading-tight mb-0.5">
                @if (line.type === 'command') {
                  <span class="text-[#4e9a06] font-bold">agent@ubuntu</span>:<span class="text-[#3465a4] font-bold">~/research</span>$ {{ line.content }}
                } @else if (line.type === 'error') {
                  <span class="text-red-400">{{ line.content }}</span>
                } @else if (line.type === 'success') {
                  <span class="text-[#4e9a06]">{{ line.content }}</span>
                } @else if (line.type === 'info') {
                  <span class="text-slate-400">{{ line.content }}</span>
                } @else {
                  <span class="text-slate-300 whitespace-pre-wrap">{{ line.content }}</span>
                }
              </div>
            }
            @if (isTyping()) {
              <div class="flex items-center">
                <span class="text-[#4e9a06] font-bold">agent@ubuntu</span>:<span class="text-[#3465a4] font-bold">~/research</span>$ <span class="w-2 h-4 bg-slate-400 animate-pulse ml-1"></span>
              </div>
            }
          </div>
        </div>

        <!-- Browser Window -->
        <div class="absolute top-20 right-20 w-[800px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
             [style.transform]="'translate(' + browserPos.x + 'px, ' + browserPos.y + 'px)'">
          <!-- Browser Chrome -->
          <div class="h-10 bg-[#f0f0f4] flex items-center px-2 border-b border-slate-300 gap-2 handle cursor-move">
            <div class="flex gap-2 mr-2">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div class="flex gap-2 text-slate-500">
              <span class="material-symbols-outlined text-sm cursor-pointer hover:text-black">arrow_back</span>
              <span class="material-symbols-outlined text-sm cursor-pointer hover:text-black">arrow_forward</span>
              <span class="material-symbols-outlined text-sm cursor-pointer hover:text-black">refresh</span>
            </div>
            <div class="flex-1 bg-white h-7 rounded border border-slate-200 flex items-center px-3 text-xs text-slate-700 shadow-sm">
              <span class="material-symbols-outlined text-[12px] mr-2 text-slate-400">lock</span>
              {{ currentUrl() }}
            </div>
            <span class="material-symbols-outlined text-slate-500 text-sm cursor-pointer hover:text-black">menu</span>
          </div>
          <!-- Browser Viewport -->
          <div class="flex-1 relative overflow-y-auto bg-white scroll-smooth" #browserViewport>
             @if (isLoadingPage()) {
                <div class="absolute inset-0 flex items-center justify-center bg-white/90 z-20 backdrop-blur-sm">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-8 h-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <p class="text-xs text-slate-500 font-bold">Loading...</p>
                  </div>
                </div>
              }
              <div [innerHTML]="browserContent()" class="min-h-full font-sans text-slate-900"></div>
          </div>
        </div>

        <!-- Agent Chat Overlay (Bottom Right) -->
        <div class="absolute bottom-4 right-4 w-80 bg-[#1e1e1e] rounded-t-lg shadow-2xl border border-slate-700 flex flex-col z-50">
          <div 
            class="bg-[#2d2d2d] p-3 rounded-t-lg flex items-center justify-between border-b border-slate-700 cursor-pointer focus:outline-none focus:bg-[#3d3d3d]" 
            (click)="toggleChat()"
            (keydown.enter)="toggleChat()"
            tabindex="0"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-xs font-bold text-white">Agent Communication</span>
            </div>
            <span class="material-symbols-outlined text-slate-400 text-sm">{{ isChatOpen() ? 'expand_more' : 'expand_less' }}</span>
          </div>
          @if (isChatOpen()) {
            <div class="h-64 bg-[#1e1e1e] p-3 overflow-y-auto flex flex-col gap-3" #chatContainer>
              @for (msg of chatMessages(); track msg) {
                <div [class.self-end]="msg.role === 'user'" [class.self-start]="msg.role === 'agent'" class="max-w-[90%]">
                  <div class="p-2 rounded text-xs" 
                       [ngClass]="{
                         'bg-orange-600 text-white': msg.role === 'user',
                         'bg-[#3E3E3E] text-slate-200': msg.role === 'agent'
                       }">
                    {{ msg.text }}
                  </div>
                </div>
              }
            </div>
            <div class="p-2 bg-[#2d2d2d] border-t border-slate-700">
              <input 
                #chatInput
                type="text" 
                placeholder="Message agent..." 
                class="w-full bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none"
                (keyup.enter)="sendMessage(chatInput.value); chatInput.value = ''"
              >
            </div>
          }
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

  currentTime = new Date();
  terminalLines = signal<TerminalLine[]>([
    { type: 'info', content: 'Ubuntu 24.04 LTS (GNU/Linux 6.5.0-14-generic x86_64)' },
    { type: 'info', content: 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.5.0-14-generic x86_64)' },
    { type: 'info', content: ' * Documentation:  https://help.ubuntu.com' },
    { type: 'info', content: ' * Management:     https://landscape.canonical.com' },
    { type: 'info', content: ' * Support:        https://ubuntu.com/advantage' },
    { type: 'info', content: '' },
    { type: 'success', content: 'System load: 0.22  Up time: 14 min' },
  ]);
  
  isTyping = signal(false);
  isChatOpen = signal(true);
  chatMessages = signal<ChatMessage[]>([
    { role: 'agent', text: 'I have root access. Starting deep research protocols.' }
  ]);

  // Window Positions (Simple static for now, could be draggable)
  terminalPos = { x: 0, y: 0 };
  browserPos = { x: 0, y: 0 };

  // Browser State
  currentUrl = signal('about:blank');
  browserContent = signal('<div class="h-full flex items-center justify-center text-slate-400">Waiting for input...</div>');
  isLoadingPage = signal(false);

  @ViewChild('terminalContainer') terminalContainer!: ElementRef;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  ngOnInit() {
    setInterval(() => this.currentTime = new Date(), 60000);
    this.startDeepResearch();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.terminalContainer) {
      this.terminalContainer.nativeElement.scrollTop = this.terminalContainer.nativeElement.scrollHeight;
    }
    if (this.chatContainer && this.isChatOpen()) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  toggleChat() {
    this.isChatOpen.update(v => !v);
  }

  addTerminalLine(type: TerminalLine['type'], content: string) {
    this.terminalLines.update(lines => [...lines, { type, content }]);
  }

  async typeCommand(command: string) {
    this.isTyping.set(true);
    // Simulate realistic typing speed variation
    // Just show the final command after a delay for better UX than char-by-char in this context
    await new Promise(r => setTimeout(r, 600)); 
    this.isTyping.set(false);
    this.addTerminalLine('command', command);
    await new Promise(r => setTimeout(r, 200));
  }

  async startDeepResearch() {
    await new Promise(r => setTimeout(r, 1500));
    
    // 1. Setup Workspace
    await this.typeCommand('mkdir -p ~/research/companies');
    await this.typeCommand('touch ~/research/targets.csv');
    
    // 2. Search for Benchmarks (Gartner, etc.)
    await this.typeCommand(`googler --json --count 3 "Gartner Magic Quadrant ${this.domain()} 2024 2025"`);
    this.addTerminalLine('info', 'Fetching search results from Google API...');
    
    // const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Simulate finding a benchmark report
    this.isLoadingPage.set(true);
    this.currentUrl.set(`https://www.gartner.com/en/${this.domain().toLowerCase()}/magic-quadrant`);
    await new Promise(r => setTimeout(r, 1500));
    this.isLoadingPage.set(false);
    
    this.browserContent.set(`
      <div class="font-sans text-slate-800">
        <header class="bg-black text-white p-4 flex justify-between items-center">
          <span class="font-bold text-xl">Gartner.</span>
          <nav class="text-sm space-x-4"><a href="#">Insights</a><a href="#">Tools</a></nav>
        </header>
        <main class="p-8 max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold mb-4">Magic Quadrant for ${this.domain()}</h1>
          <p class="text-lg text-slate-600 mb-8">Market leaders and visionaries defining the future of ${this.domain()}.</p>
          <div class="border border-slate-200 p-6 rounded bg-slate-50 mb-8">
            <h3 class="font-bold mb-4">Key Leaders</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>Apex Systems</strong> - Visionary leader in enterprise integration.</li>
              <li><strong>Nebula Corp</strong> - Strong execution ability with legacy support.</li>
              <li><strong>QuantumSoft</strong> - Innovative AI-first approach.</li>
            </ul>
          </div>
        </main>
      </div>
    `);

    await this.typeCommand('python3 extract_leaders.py --url ' + this.currentUrl());
    this.addTerminalLine('output', 'Processing DOM...');
    this.addTerminalLine('success', 'Extracted 3 companies: Apex Systems, Nebula Corp, QuantumSoft');
    
    // Save these companies
    const leaders = [
      { name: 'Apex Systems', desc: 'Visionary leader in enterprise integration.' },
      { name: 'Nebula Corp', desc: 'Strong execution ability with legacy support.' },
      { name: 'QuantumSoft', desc: 'Innovative AI-first approach.' }
    ];
    
    for (const c of leaders) {
      this.companyService.addCompany({
        name: c.name,
        domain: this.domain(),
        description: c.desc,
        status: 'New',
        score: 95,
        website: `https://www.example.com/${c.name.toLowerCase().replace(' ', '')}`,
        founded: 2010
      });
    }

    // 3. Search for Startups (Deep Search)
    await this.typeCommand(`googler "Top ${this.domain()} startups 2025"`);
    
    this.isLoadingPage.set(true);
    this.currentUrl.set('https://techcrunch.com/category/startups');
    await new Promise(r => setTimeout(r, 1500));
    this.isLoadingPage.set(false);
    
    this.browserContent.set(`
      <div class="font-sans text-slate-900 bg-white min-h-full">
        <div class="border-b border-black p-4"><h1 class="font-bold text-green-600 text-2xl">TechCrunch</h1></div>
        <div class="p-6 grid gap-6">
          <article class="border-b pb-4">
            <h2 class="text-xl font-bold hover:text-green-600 cursor-pointer">The Next Gen of ${this.domain()}</h2>
            <p class="text-slate-600 mt-2">New players like <strong>FlowState</strong> and <strong>DataMesh</strong> are disrupting the incumbents...</p>
          </article>
          <article class="border-b pb-4">
            <h2 class="text-xl font-bold hover:text-green-600 cursor-pointer">Funding News</h2>
            <p class="text-slate-600 mt-2"><strong>CyberShield</strong> raises Series B to secure IoT devices.</p>
          </article>
        </div>
      </div>
    `);

    await this.typeCommand('grep -r "Series [A-B]" .');
    this.addTerminalLine('output', 'Found matches in article_cache_293.html');
    
    const startups = ['FlowState', 'DataMesh', 'CyberShield'];
    for (const s of startups) {
      await this.typeCommand(`whois ${s.toLowerCase()}.com`);
      this.addTerminalLine('info', `Verifying domain for ${s}...`);
      await new Promise(r => setTimeout(r, 500));
      this.companyService.addCompany({
        name: s,
        domain: this.domain(),
        description: `Emerging startup in ${this.domain()} space.`,
        status: 'New',
        score: 85,
        website: `https://${s.toLowerCase()}.com`,
        founded: 2023
      });
    }
    this.addTerminalLine('success', `Added ${startups.length} startups to database.`);

    // 4. Finalize
    await this.typeCommand('cat ~/research/targets.csv');
    this.addTerminalLine('output', 'Apex Systems, Nebula Corp, QuantumSoft, FlowState, DataMesh, CyberShield');
    
    this.chatMessages.update(msgs => [...msgs, { role: 'agent', text: 'Research complete. I have extracted market leaders from Gartner benchmarks and identified promising startups from industry news. All data has been piped to your dashboard.' }]);
    
    this.filterService.addDomain(this.domain());
    this.filterService.setDomain(this.domain());
    
    await this.typeCommand('exit');
    
    setTimeout(() => {
      this.finished.emit();
    }, 3000);
  }

  sendMessage(text: string) {
    if (!text.trim()) return;
    this.chatMessages.update(msgs => [...msgs, { role: 'user', text }]);
    setTimeout(() => {
      this.chatMessages.update(msgs => [...msgs, { role: 'agent', text: "I'm running a background extraction process. I'll get back to you in a moment." }]);
    }, 1000);
  }
}
