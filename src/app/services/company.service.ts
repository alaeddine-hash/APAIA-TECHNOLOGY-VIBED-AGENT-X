import { Injectable, signal } from '@angular/core';

export interface Company {
  name: string;
  domain: string;
  description: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Rejected';
  score: number;
  logoUrl?: string;
  website?: string;
  founded?: number;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies = signal<Company[]>([
    // Initial mock data can be moved here if needed, or we just append to it
  ]);

  getCompanies() {
    return this.companies;
  }

  addCompany(company: Company) {
    this.companies.update(current => [...current, company]);
  }

  addCompanies(newCompanies: Company[]) {
    this.companies.update(current => [...current, ...newCompanies]);
  }
}
