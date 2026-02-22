import { Injectable, signal, computed } from '@angular/core';

export interface UseCase {
  id: string;
  name: string;
  domains: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  useCases: UseCase[] = [
    { 
      id: 'ai_labeling', 
      name: 'AI Data Labeling', 
      domains: ['Technology', 'Healthcare', 'Automotive'] 
    },
    { 
      id: 'cloud_migration', 
      name: 'Cloud Migration', 
      domains: ['Technology', 'Finance', 'Retail'] 
    },
    { 
      id: 'cyber_audit', 
      name: 'Cybersecurity Audit', 
      domains: ['Finance', 'Government', 'Technology'] 
    },
    { 
      id: 'erp_impl', 
      name: 'ERP Implementation', 
      domains: ['Manufacturing', 'Logistics', 'Retail'] 
    }
  ];

  // Global list of all known domains
  domains = signal<string[]>([
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Logistics', 'Government', 'Automotive'
  ]);

  selectedUseCase = signal<UseCase>(this.useCases[0]);
  selectedDomain = signal<string>(this.useCases[0].domains[0]);

  availableDomains = computed(() => {
    // Return domains associated with the use case, but also ensure they exist in the global list if needed
    // For now, we just return the use case's domains as per original logic, 
    // but we might want to merge with dynamically added ones if they are relevant.
    // Let's stick to the use case's domains for the dropdown context.
    return this.selectedUseCase().domains;
  });

  setUseCase(useCaseName: string) {
    const useCase = this.useCases.find(u => u.name === useCaseName);
    if (useCase) {
      this.selectedUseCase.set(useCase);
      // Reset domain to the first one of the new use case if current is not valid
      if (!useCase.domains.includes(this.selectedDomain())) {
        this.selectedDomain.set(useCase.domains[0]);
      }
    }
  }

  setDomain(domain: string) {
    this.selectedDomain.set(domain);
  }

  addDomain(domain: string) {
    if (!this.domains().includes(domain)) {
      this.domains.update(d => [...d, domain]);
      
      // Also add to the current use case's domain list so it appears in the dropdown
      const currentUseCase = this.selectedUseCase();
      if (!currentUseCase.domains.includes(domain)) {
        currentUseCase.domains.push(domain);
        // Trigger signal update by re-setting (mutating object in signal is tricky without immutability)
        // Better to just update the signal if we were using signals for useCases, but useCases is a static array here.
        // Since availableDomains is computed from selectedUseCase(), modifying the object inside the signal might not trigger it unless we call set/update.
        this.selectedUseCase.update(u => ({...u})); 
      }
    }
  }
}
