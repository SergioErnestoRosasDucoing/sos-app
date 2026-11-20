export interface ActionPlanStep {
  id: string;
  title: string;
  description: string;
}

export interface ActionPlanContact {
  name: string;
  number: string;
  type: string;
  icon: string;
  color: string;
}

export interface ActionPlanResponse {
  categoryTitle: string;
  subtitle: string;
  steps: ActionPlanStep[];
  emergencyContacts: ActionPlanContact[];
  safetyTip: string;
  ctaButtonText: string;
  targetSpecialty: string;
}
