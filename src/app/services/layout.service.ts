import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isSidebarExpanded = signal(false);

  toggleSidebar() {
    this.isSidebarExpanded.update(v => !v);
  }
}
