import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0da6f2_0%,transparent_40%)] opacity-10"></div>
      <div class="absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(to_top,#0da6f2_1px,transparent_1px)] bg-[length:40px_40px] opacity-[0.03]"></div>

      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative z-10">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0da6f2] text-white mb-4 shadow-lg shadow-[#0da6f2]/30">
            <span class="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p class="text-slate-500 mt-2">Sign in to X Agents to continue sourcing.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="name@company.com"
            >
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider" for="password">Password</label>
              <a href="#" class="text-xs font-medium text-[#0da6f2] hover:underline">Forgot password?</a>
            </div>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="••••••••"
            >
          </div>

          <button 
            type="submit" 
            class="w-full py-3 px-4 bg-[#0da6f2] hover:bg-[#0da6f2]/90 text-white font-bold rounded-lg shadow-lg shadow-[#0da6f2]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-slate-500">
            Don't have an account? 
            <a routerLink="/register" class="font-bold text-[#0da6f2] hover:underline">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      // Mock login
      this.router.navigate(['/dashboard']);
    }
  }
}
