import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#14b8a6_0%,transparent_40%)] opacity-10"></div>
      <div class="absolute top-0 right-0 w-full h-1/2 bg-[linear-gradient(to_bottom,#0da6f2_1px,transparent_1px)] bg-[length:40px_40px] opacity-[0.03]"></div>

      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative z-10">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-slate-900">Create Account</h1>
          <p class="text-slate-500 mt-2">Join X Agents for AI-powered sourcing.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" for="firstName">First Name</label>
              <input 
                id="firstName" 
                type="text" 
                formControlName="firstName"
                class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder="Jane"
              >
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" for="lastName">Last Name</label>
              <input 
                id="lastName" 
                type="text" 
                formControlName="lastName"
                class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder="Doe"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" for="email">Work Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="name@company.com"
            >
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0da6f2] focus:ring-2 focus:ring-[#0da6f2]/20 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="Create a strong password"
            >
          </div>

          <div class="flex items-start gap-3">
            <input type="checkbox" id="terms" class="mt-1 rounded border-slate-300 text-[#0da6f2] focus:ring-[#0da6f2]">
            <label for="terms" class="text-xs text-slate-500">
              I agree to the <a href="#" class="text-[#0da6f2] hover:underline">Terms of Service</a> and <a href="#" class="text-[#0da6f2] hover:underline">Privacy Policy</a>.
            </label>
          </div>

          <button 
            type="submit" 
            class="w-full py-3 px-4 bg-[#0da6f2] hover:bg-[#0da6f2]/90 text-white font-bold rounded-lg shadow-lg shadow-[#0da6f2]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-slate-500">
            Already have an account? 
            <a routerLink="/login" class="font-bold text-[#0da6f2] hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      // Mock register
      this.router.navigate(['/dashboard']);
    }
  }
}
