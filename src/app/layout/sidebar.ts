import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside 
      class="fixed left-0 top-0 h-screen flex flex-col py-8 bg-slate-900 text-white z-[60] border-r border-[#0da6f2]/20 transition-all duration-300 overflow-hidden"
      [class.w-20]="!layoutService.isSidebarExpanded()"
      [class.w-64]="layoutService.isSidebarExpanded()"
    >
      <div class="flex items-center justify-between px-4 mb-12">
        <div class="bg-[#0da6f2] p-2 rounded-xl shadow-lg shadow-[#0da6f2]/50 flex-shrink-0">
          <span class="material-symbols-outlined text-white text-2xl">rocket_launch</span>
        </div>
        @if (layoutService.isSidebarExpanded()) {
          <span class="font-bold text-lg whitespace-nowrap ml-3">X Agents</span>
        }
        <button (click)="layoutService.toggleSidebar()" class="text-slate-400 hover:text-white transition-colors ml-auto p-1">
          <span class="material-symbols-outlined">{{ layoutService.isSidebarExpanded() ? 'chevron_left' : 'chevron_right' }}</span>
        </button>
      </div>

      <nav class="flex flex-col gap-2 px-3">
        <a routerLink="/dashboard" routerLinkActive="bg-[#0da6f2]/10 text-[#0da6f2] border-[#0da6f2]/30" [routerLinkActiveOptions]="{exact: true}" class="p-3 rounded-xl text-slate-400 hover:text-[#0da6f2] border border-transparent transition-colors flex items-center group overflow-hidden whitespace-nowrap">
          <span class="material-symbols-outlined flex-shrink-0">dashboard</span>
          <span class="ml-4 font-medium opacity-0 transition-opacity duration-300" [class.opacity-100]="layoutService.isSidebarExpanded()" [class.hidden]="!layoutService.isSidebarExpanded()">Dashboard</span>
        </a>
        <a routerLink="/sourcing-wizard" routerLinkActive="bg-[#0da6f2]/10 text-[#0da6f2] border-[#0da6f2]/30" class="p-3 rounded-xl text-slate-400 hover:text-[#0da6f2] border border-transparent transition-colors flex items-center group overflow-hidden whitespace-nowrap">
          <span class="material-symbols-outlined flex-shrink-0">explore</span>
          <span class="ml-4 font-medium opacity-0 transition-opacity duration-300" [class.opacity-100]="layoutService.isSidebarExpanded()" [class.hidden]="!layoutService.isSidebarExpanded()">Sourcing Wizard</span>
        </a>
        <a routerLink="/companies" routerLinkActive="bg-[#0da6f2]/10 text-[#0da6f2] border-[#0da6f2]/30" class="p-3 rounded-xl text-slate-400 hover:text-[#0da6f2] border border-transparent transition-colors flex items-center group overflow-hidden whitespace-nowrap">
          <span class="material-symbols-outlined flex-shrink-0">corporate_fare</span>
          <span class="ml-4 font-medium opacity-0 transition-opacity duration-300" [class.opacity-100]="layoutService.isSidebarExpanded()" [class.hidden]="!layoutService.isSidebarExpanded()">Companies</span>
        </a>
        <a routerLink="/relevant-links" routerLinkActive="bg-[#0da6f2]/10 text-[#0da6f2] border-[#0da6f2]/30" class="p-3 rounded-xl text-slate-400 hover:text-[#0da6f2] border border-transparent transition-colors flex items-center group overflow-hidden whitespace-nowrap">
          <span class="material-symbols-outlined flex-shrink-0">hub</span>
          <span class="ml-4 font-medium opacity-0 transition-opacity duration-300" [class.opacity-100]="layoutService.isSidebarExpanded()" [class.hidden]="!layoutService.isSidebarExpanded()">Relevant Links</span>
        </a>
        <a routerLink="/magic-quadrant" routerLinkActive="bg-[#0da6f2]/10 text-[#0da6f2] border-[#0da6f2]/30" class="p-3 rounded-xl text-slate-400 hover:text-[#0da6f2] border border-transparent transition-colors flex items-center group overflow-hidden whitespace-nowrap">
          <span class="material-symbols-outlined flex-shrink-0">grid_view</span>
          <span class="ml-4 font-medium opacity-0 transition-opacity duration-300" [class.opacity-100]="layoutService.isSidebarExpanded()" [class.hidden]="!layoutService.isSidebarExpanded()">Magic Quadrant</span>
        </a>
      </nav>

      <div class="mt-auto px-3">
        <a routerLink="/login" class="w-full p-3 rounded-xl text-slate-400 hover:text-red-400 transition-colors flex items-center group overflow-hidden whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined flex-shrink-0">logout</span>
          <span class="ml-4 font-medium opacity-0 transition-opacity duration-300" [class.opacity-100]="layoutService.isSidebarExpanded()" [class.hidden]="!layoutService.isSidebarExpanded()">Logout</span>
        </a>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  layoutService = inject(LayoutService);
}
