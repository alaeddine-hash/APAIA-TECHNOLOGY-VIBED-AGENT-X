import { Injectable } from '@angular/core';

export interface SourcingDraft {
  useCase: string;
  expectedOutput: string;
  goalImpact: string;
  environment: string;
}

@Injectable({
  providedIn: 'root'
})
export class SourcingService {
  private readonly STORAGE_KEY = 'sourcing_draft';

  saveDraft(draft: Partial<SourcingDraft>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draft));
  }

  getDraft(): Partial<SourcingDraft> | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearDraft(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
