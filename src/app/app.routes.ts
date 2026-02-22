import {Routes} from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { SourcingWizardComponent } from './pages/sourcing-wizard/sourcing-wizard';
import { CompaniesComponent } from './pages/companies/companies';
import { RelevantLinksComponent } from './pages/relevant-links/relevant-links';
import { MagicQuadrantComponent } from './pages/magic-quadrant/magic-quadrant';
import { ProfileComponent } from './pages/profile/profile';
import { LoginComponent } from './pages/auth/login';
import { RegisterComponent } from './pages/auth/register';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sourcing-wizard', component: SourcingWizardComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'relevant-links', component: RelevantLinksComponent },
  { path: 'magic-quadrant', component: MagicQuadrantComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'dashboard' }
];
