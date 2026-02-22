import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GoogleGenAI } from "@google/genai";
import { SourcingService, SourcingDraft } from '../../services/sourcing.service';
import { AgentSandboxComponent } from './agent-sandbox';
import { Router } from '@angular/router';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-sourcing-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, AgentSandboxComponent],
  template: `
    <div class="max-w-[1440px] mx-auto px-4 md:px-10 py-8">
      <!-- Agent Sandbox Mode (Step 3) -->
      @if (currentStep() === 3) {
        <app-agent-sandbox 
          [domain]="selectedDomain()" 
          [useCase]="sourcingForm.get('useCase')?.value || ''"
          (finished)="onAgentFinished()"
        ></app-agent-sandbox>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main Wizard Content -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Stepper -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between px-2">
              <div class="flex items-center gap-3" [class.opacity-50]="currentStep() === 2">
                <div class="flex items-center justify-center size-8 rounded-full bg-[#0da6f2] text-white font-bold text-sm shadow-[0_0_0_0_rgba(13,166,242,0.7)]" [class.animate-[pulse_2s_infinite]]="currentStep() === 1">1</div>
                <span class="font-bold text-lg">Define Use Case</span>
              </div>
              <div class="h-px flex-1 mx-6 bg-slate-200 relative">
                <div class="absolute inset-0 bg-[#0da6f2]/30" [style.width]="currentStep() === 2 ? '100%' : '50%'"></div>
              </div>
              <div class="flex items-center gap-3" [class.opacity-40]="currentStep() === 1">
                <div class="flex items-center justify-center size-8 rounded-full border-2" [class.border-slate-400]="currentStep() === 1" [class.text-slate-500]="currentStep() === 1" [class.bg-[#0da6f2]]="currentStep() === 2" [class.border-[#0da6f2]]="currentStep() === 2" [class.text-white]="currentStep() === 2">2</div>
                <span class="font-medium text-lg" [class.font-bold]="currentStep() === 2">Research Domains</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col gap-2">
            <h1 class="text-4xl font-bold tracking-tight">Sourcing Wizard</h1>
            <p class="text-slate-500">
              @if (currentStep() === 1) {
                Step 1: Provide context to initialize the AI sourcing engine.
              } @else {
                Step 2: Review and select generated research domains.
              }
            </p>
          </div>

          <!-- Step 1: Form Section -->
          @if (currentStep() === 1) {
            <div class="bg-white/70 backdrop-blur-md rounded-xl p-8 relative overflow-hidden group shadow-2xl shadow-[#0da6f2]/5 border border-[#0da6f2]/20">
              <!-- HUD Decorative Corners -->
              <div class="absolute w-2.5 h-2.5 border-t-2 border-l-2 border-[#0da6f2] top-4 left-4"></div>
              <div class="absolute w-2.5 h-2.5 border-t-2 border-r-2 border-[#0da6f2] top-4 right-4"></div>
              <div class="absolute w-2.5 h-2.5 border-b-2 border-l-2 border-[#0da6f2] bottom-4 left-4"></div>
              <div class="absolute w-2.5 h-2.5 border-b-2 border-r-2 border-[#0da6f2] bottom-4 right-4"></div>

              <form [formGroup]="sourcingForm" class="space-y-6">
                <!-- Use Case Input -->
                <div class="space-y-2">
                  <label class="text-sm font-semibold uppercase tracking-wider text-[#0da6f2]" for="use-case">What are you sourcing today?</label>
                  <textarea id="use-case" formControlName="useCase" class="w-full bg-white/50 border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 rounded-lg p-4 transition-all outline-none resize-none font-sans focus:shadow-[0_0_10px_rgba(13,166,242,0.3)]" placeholder="e.g., Enterprise CRM for a 500-seat logistics firm specializing in cold chain transport..." rows="4"></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Expected Output -->
                  <div class="space-y-2">
                    <label class="text-sm font-semibold uppercase tracking-wider text-[#0da6f2]" for="expected-output">Expected Output</label>
                    <textarea id="expected-output" formControlName="expectedOutput" class="w-full bg-white/50 border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 rounded-lg p-4 transition-all outline-none resize-none font-sans text-sm focus:shadow-[0_0_10px_rgba(13,166,242,0.3)]" placeholder="Comparative Matrix, Vendor ROI, Risk Assessment..." rows="3"></textarea>
                  </div>
                  <!-- Goal & Impact -->
                  <div class="space-y-2">
                    <label class="text-sm font-semibold uppercase tracking-wider text-[#0da6f2]" for="goal-impact">Goal & Impact</label>
                    <textarea id="goal-impact" formControlName="goalImpact" class="w-full bg-white/50 border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 rounded-lg p-4 transition-all outline-none resize-none font-sans text-sm focus:shadow-[0_0_10px_rgba(13,166,242,0.3)]" placeholder="Reduce operational overhead by 15% within 12 months..." rows="3"></textarea>
                  </div>
                </div>
                <!-- Project Environment Radio -->
                <div class="space-y-3">
                  <div class="text-sm font-semibold uppercase tracking-wider text-[#0da6f2]">Project Environment</div>
                  <div class="flex flex-wrap gap-4">
                    <label class="flex-1 cursor-pointer group">
                      <input class="peer hidden" formControlName="environment" type="radio" value="greenfield"/>
                      <div class="flex flex-col p-4 border-2 border-slate-100 rounded-lg transition-all peer-checked:border-[#0da6f2] peer-checked:bg-[#0da6f2]/5 hover:border-[#0da6f2]/40 group-hover:shadow-md peer-checked:shadow-[0_0_10px_rgba(13,166,242,0.3)]">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="material-symbols-outlined text-[#0da6f2]">eco</span>
                          <span class="font-bold">Greenfield</span>
                        </div>
                        <p class="text-xs text-slate-500">New implementation with no legacy systems.</p>
                      </div>
                    </label>
                    <label class="flex-1 cursor-pointer group">
                      <input class="peer hidden" formControlName="environment" type="radio" value="brownfield"/>
                      <div class="flex flex-col p-4 border-2 border-slate-100 rounded-lg transition-all peer-checked:border-[#0da6f2] peer-checked:bg-[#0da6f2]/5 hover:border-[#0da6f2]/40 group-hover:shadow-md">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="material-symbols-outlined text-[#0da6f2]">foundation</span>
                          <span class="font-bold">Brownfield</span>
                        </div>
                        <p class="text-xs text-slate-500">Integration or replacement of existing systems.</p>
                      </div>
                    </label>
                  </div>
                </div>
                <!-- Action Bar -->
                <div class="pt-6 flex items-center justify-between border-t border-[#0da6f2]/10">
                  <button class="flex items-center gap-2 text-slate-500 hover:text-[#0da6f2] font-medium transition-colors" type="button" (click)="saveDraft()">
                    <span class="material-symbols-outlined">save</span>
                    Save Draft
                  </button>
                  <button 
                    class="bg-[#0da6f2] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-3 hover:scale-105 transition-transform uppercase tracking-widest text-xs shadow-[0_0_0_0_rgba(13,166,242,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                    type="button" 
                    (click)="generateDomains()"
                    [disabled]="sourcingForm.invalid || isLoading()"
                  >
                    @if (isLoading()) {
                      <span class="material-symbols-outlined animate-spin">sync</span>
                      Generating...
                    } @else {
                      Define Research Topics
                      <span class="material-symbols-outlined">arrow_forward</span>
                    }
                  </button>
                </div>
              </form>
            </div>
          } @else {
            <!-- Step 2: Results Section -->
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- User Aligned Domains -->
                <div class="space-y-4">
                  <h3 class="text-sm font-bold uppercase tracking-wider text-[#0da6f2] flex items-center gap-2">
                    <span class="material-symbols-outlined">person</span>
                    Aligned with Request
                  </h3>
                  @for (domain of generatedDomains().slice(0, 2); track domain) {
                    <div 
                      class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-[#0da6f2] transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#0da6f2]" 
                      (click)="selectDomain(domain)"
                      (keydown.enter)="selectDomain(domain)"
                      tabindex="0"
                    >
                      <div class="flex justify-between items-start">
                        <h4 class="font-bold text-lg text-slate-800 group-hover:text-[#0da6f2] transition-colors">{{ domain }}</h4>
                        <span class="material-symbols-outlined text-slate-300 group-hover:text-[#0da6f2]">check_circle</span>
                      </div>
                      <p class="text-sm text-slate-500 mt-2">Directly relevant to your specified use case and environment.</p>
                    </div>
                  }
                </div>

                <!-- Industry/AI Domains -->
                <div class="space-y-4">
                  <h3 class="text-sm font-bold uppercase tracking-wider text-purple-500 flex items-center gap-2">
                    <span class="material-symbols-outlined">auto_awesome</span>
                    AI & Automation Trends
                  </h3>
                  @for (domain of generatedDomains().slice(2, 5); track domain) {
                    <div 
                      class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      (click)="selectDomain(domain)"
                      (keydown.enter)="selectDomain(domain)"
                      tabindex="0"
                    >
                      <div class="flex justify-between items-start">
                        <h4 class="font-bold text-lg text-slate-800 group-hover:text-purple-500 transition-colors">{{ domain }}</h4>
                        <span class="material-symbols-outlined text-slate-300 group-hover:text-purple-500">trending_up</span>
                      </div>
                      <p class="text-sm text-slate-500 mt-2">Emerging opportunities in AI and automation for this sector.</p>
                    </div>
                  }
                </div>
              </div>

              <div class="pt-6 flex items-center justify-between border-t border-slate-200">
                <button class="flex items-center gap-2 text-slate-500 hover:text-[#0da6f2] font-medium transition-colors" type="button" (click)="currentStep.set(1)">
                  <span class="material-symbols-outlined">arrow_back</span>
                  Back to Edit
                </button>
                <button class="bg-[#0da6f2] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-3 hover:scale-105 transition-transform uppercase tracking-widest text-xs shadow-lg" type="button" (click)="confirmSelection()">
                  Confirm Selection
                  <span class="material-symbols-outlined">check</span>
                </button>
              </div>
            </div>
          }
        </div>
        
        <!-- Sidebar Quick Start -->
        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-[#0da6f2]/20 shadow-lg">
            <div class="flex items-center gap-2 mb-6">
              <span class="material-symbols-outlined text-[#0da6f2]">bolt</span>
              <h3 class="font-bold text-lg tracking-tight uppercase">Quick Start</h3>
            </div>
            <p class="text-sm text-slate-500 mb-6 leading-relaxed">Prepopulate from your recent searches or select a template to accelerate the wizard.</p>
            <div class="space-y-4">
              <!-- Recent Search Card 1 -->
              <button class="w-full text-left p-4 rounded-lg bg-white/40 border border-slate-100 hover:border-[#0da6f2]/40 hover:bg-white/80 transition-all group" (click)="quickStart('Enterprise')">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-[#0da6f2] uppercase tracking-tighter">Enterprise</span>
                  <span class="text-[10px] text-slate-400">2h ago</span>
                </div>
                <p class="text-sm font-semibold line-clamp-2 group-hover:text-[#0da6f2] transition-colors">Global Logistics ERP Sourcing</p>
              </button>
              <!-- Recent Search Card 2 -->
              <button class="w-full text-left p-4 rounded-lg bg-white/40 border border-slate-100 hover:border-[#0da6f2]/40 hover:bg-white/80 transition-all group" (click)="quickStart('Security')">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-[#0da6f2] uppercase tracking-tighter">Security</span>
                  <span class="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <p class="text-sm font-semibold line-clamp-2 group-hover:text-[#0da6f2] transition-colors">Zero Trust Networking Vendors</p>
              </button>
              <!-- Recent Search Card 3 -->
              <button class="w-full text-left p-4 rounded-lg bg-white/40 border border-slate-100 hover:border-[#0da6f2]/40 hover:bg-white/80 transition-all group" (click)="quickStart('Marketing')">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-[#0da6f2] uppercase tracking-tighter">Marketing</span>
                  <span class="text-[10px] text-slate-400">Oct 12</span>
                </div>
                <p class="text-sm font-semibold line-clamp-2 group-hover:text-[#0da6f2] transition-colors">Headless CMS for E-commerce</p>
              </button>
            </div>
            <button class="w-full mt-6 py-3 text-sm font-bold border border-[#0da6f2]/20 text-[#0da6f2] hover:bg-[#0da6f2]/10 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer" (click)="viewAllSearches()">
              <span class="material-symbols-outlined text-lg">history</span>
              View All Recent Searches
            </button>
          </div>
          <!-- Helper Card -->
          <div class="bg-[#0da6f2]/5 border border-[#0da6f2]/20 rounded-xl p-6 relative overflow-hidden">
            <div class="absolute -right-4 -bottom-4 opacity-10">
              <span class="material-symbols-outlined text-8xl text-[#0da6f2]">lightbulb</span>
            </div>
            <h4 class="font-bold text-[#0da6f2] mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">info</span>
              AI Tip
            </h4>
            <p class="text-sm text-slate-600 leading-relaxed italic">
              "Be specific about your industry and scale. The more context you provide here, the more precise Step 2's research topics will be."
            </p>
          </div>
        </aside>
        </div>
      }
    </div>
  `
})
export class SourcingWizardComponent implements OnInit {
  fb = inject(FormBuilder);
  sourcingService = inject(SourcingService);
  router = inject(Router);
  filterService = inject(FilterService);
  
  sourcingForm = this.fb.group({
    useCase: ['', Validators.required],
    expectedOutput: ['', Validators.required],
    goalImpact: ['', Validators.required],
    environment: ['greenfield', Validators.required]
  });

  currentStep = signal(1);
  isLoading = signal(false);
  generatedDomains = signal<string[]>([]);
  selectedDomain = signal('');

  ngOnInit() {
    const draft = this.sourcingService.getDraft();
    if (draft) {
      this.sourcingForm.patchValue(draft);
      // Optional: Show a toast or message that draft was loaded
      console.log('Draft loaded from storage');
    }
  }

  saveDraft() {
    const draft = this.sourcingForm.value;
    this.sourcingService.saveDraft(draft as unknown as Partial<SourcingDraft>);
    alert('Draft saved successfully! You can resume this session later.');
  }

  async generateDomains() {
    if (this.sourcingForm.invalid) return;

    this.isLoading.set(true);
    const { useCase, expectedOutput, goalImpact, environment } = this.sourcingForm.value;

    const prompt = `
      Based on the following sourcing request:
      Use Case: ${useCase}
      Expected Output: ${expectedOutput}
      Goal & Impact: ${goalImpact}
      Project Environment: ${environment}

      Generate 5 research domains. 
      The first 2 should be strictly aligned with the user's specific request.
      The next 3 should be broader IT domains specifically focusing on AI and Automation features relevant to the request.
      
      Return ONLY a JSON array of strings. Example: ["Domain 1", "Domain 2", "Domain 3", "Domain 4", "Domain 5"]
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('No response from AI');
      }
      const domains = JSON.parse(text);
      this.generatedDomains.set(domains);
      this.currentStep.set(2);
    } catch (error) {
      console.error('Error generating domains:', error);
      alert('Failed to generate domains. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  selectDomain(domain: string) {
    this.selectedDomain.set(domain);
    this.filterService.addDomain(domain);
    this.filterService.setDomain(domain);
    this.currentStep.set(3); // Move to Agent Sandbox
  }

  onAgentFinished() {
    // Navigate to companies page to see results
    this.router.navigate(['/companies']);
  }

  confirmSelection() {
    // Clear draft on successful completion if desired, or keep it.
    // this.sourcingService.clearDraft(); 
    alert('Please select a specific domain to proceed with the AI Agent.');
  }

  quickStart(type: string) {
    // Pre-fill form based on type for demo
    if (type === 'Enterprise') {
      this.sourcingForm.patchValue({
        useCase: 'Global Logistics ERP Sourcing',
        expectedOutput: 'Vendor ROI Analysis',
        goalImpact: 'Optimize supply chain efficiency by 20%',
        environment: 'brownfield'
      });
    } else if (type === 'Security') {
      this.sourcingForm.patchValue({
        useCase: 'Zero Trust Networking Vendors',
        expectedOutput: 'Security Compliance Matrix',
        goalImpact: 'Achieve SOC2 compliance',
        environment: 'greenfield'
      });
    } else {
      this.sourcingForm.patchValue({
        useCase: 'Headless CMS for E-commerce',
        expectedOutput: 'Feature Comparison Chart',
        goalImpact: 'Improve site speed by 40%',
        environment: 'brownfield'
      });
    }
  }

  viewAllSearches() {
    alert('Viewing all recent searches...');
  }
}
