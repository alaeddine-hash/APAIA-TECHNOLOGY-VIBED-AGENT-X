import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './layout/sidebar';
import { TopbarComponent } from './layout/topbar';
import { FooterComponent } from './layout/footer';
import { LayoutService } from './services/layout.service';
import { filter } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, FooterComponent],
  template: `
    @if (!isAuthPage()) {
      <app-sidebar></app-sidebar>
      <div 
        class="flex flex-col min-h-screen transition-all duration-300"
        [class.ml-20]="!layoutService.isSidebarExpanded()"
        [class.ml-64]="layoutService.isSidebarExpanded()"
      >
        <app-topbar></app-topbar>
        <div class="flex-1">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  styleUrl: './app.css',
})
export class App {
  layoutService = inject(LayoutService);
  router = inject(Router);
  isAuthPage = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: unknown) => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage.set(event.url.includes('/login') || event.url.includes('/register'));
      }
    });
  }
}
