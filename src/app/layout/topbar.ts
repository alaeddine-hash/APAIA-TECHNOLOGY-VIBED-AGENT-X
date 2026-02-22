import { Component, inject } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#0da6f2]/10 px-4 md:px-10 py-3">
      <div class="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <!-- Logo & Search -->
        <div class="flex items-center gap-8">
          <!-- Global Search -->
          <div class="hidden md:flex items-center bg-[#0da6f2]/5 border border-[#0da6f2]/10 rounded-lg px-3 py-1.5 w-64">
            <span class="material-symbols-outlined text-[#0da6f2]/60 text-xl">search</span>
            <input class="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full placeholder:text-[#0da6f2]/40 ml-2" placeholder="Search companies..." type="text"/>
          </div>
        </div>
        <!-- Dynamic Context Switchers -->
        <div class="hidden xl:flex items-center gap-4">
          <div class="relative group">
            <div class="flex items-center gap-2 bg-white border border-[#0da6f2]/20 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer hover:border-[#0da6f2] transition-colors">
              <span class="material-symbols-outlined text-[#0da6f2] text-sm">workspaces</span>
              <span class="text-slate-500 uppercase tracking-wider">Use Case:</span>
              <span class="text-slate-900">{{ filterService.selectedUseCase().name }}</span>
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </div>
            <div class="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover:block z-50">
              <div class="py-1">
                @for (useCase of filterService.useCases; track useCase.id) {
                  <button (click)="filterService.setUseCase(useCase.name)" class="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0da6f2]">
                    {{ useCase.name }}
                  </button>
                }
              </div>
            </div>
          </div>
          <div class="relative group">
            <div class="flex items-center gap-2 bg-white border border-[#0da6f2]/20 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer hover:border-[#0da6f2] transition-colors">
              <span class="material-symbols-outlined text-[#0da6f2] text-sm">language</span>
              <span class="text-slate-500 uppercase tracking-wider">Domain:</span>
              <span class="text-slate-900">{{ filterService.selectedDomain() }}</span>
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </div>
            <div class="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover:block z-50">
              <div class="py-1">
                @for (domain of filterService.availableDomains(); track domain) {
                  <button (click)="filterService.setDomain(domain)" class="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0da6f2]">
                    {{ domain }}
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
        <!-- Profile & Actions -->
        <div class="flex items-center gap-4">
          <button class="relative p-2 text-slate-500 hover:text-[#0da6f2] transition-colors" (click)="toggleNotifications()">
            <span class="material-symbols-outlined">notifications</span>
            <span class="absolute top-2 right-2 w-2 h-2 bg-[#0da6f2] rounded-full border-2 border-white"></span>
          </button>
          <div class="h-8 w-[1px] bg-[#0da6f2]/10 mx-2"></div>
          <button class="flex items-center gap-3 group cursor-pointer text-left" (click)="openProfile()">
            <div class="hidden sm:block">
              <p class="text-sm font-bold leading-none">Agent Sarah</p>
              <p class="text-[10px] text-[#0da6f2] font-medium tracking-widest uppercase mt-1">Pro Tier</p>
            </div>
            <div class="relative">
              <img alt="User Profile" class="w-10 h-10 rounded-lg object-cover ring-2 ring-[#0da6f2]/20 group-hover:ring-[#0da6f2] transition-all" src="https://picsum.photos/seed/sarah/200/200"/>
              <div class="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            </div>
          </button>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent {
  filterService = inject(FilterService);
  router = inject(Router);

  toggleNotifications() {
    alert('Notifications clicked');
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }
}
