export interface TriageOption {
  id: string;
  label: string;
  icon: string;
}

export interface TriageCriticalAlert {
  title: string;
  items: string[];
}

export interface TriageCategoryResponse {
  categoryName: string;
  botIntro: string;
  options: TriageOption[];
  criticalAlerts: Record<string, TriageCriticalAlert>;
}
