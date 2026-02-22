import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-slate-200 bg-white py-8 text-slate-500 text-sm mt-auto">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#0da6f2]">verified_user</span>
          <span class="font-bold uppercase tracking-widest text-xs">APAIA-TECHNOLOGY 2026</span>
        </div>
        <div class="text-xs font-medium uppercase tracking-wider opacity-80">
          By Alaeddine Mansouri
        </div>
        <div class="flex gap-6 text-xs font-medium">
          <a href="#" class="hover:text-[#0da6f2] transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-[#0da6f2] transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-[#0da6f2] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
