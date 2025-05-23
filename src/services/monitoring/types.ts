
export interface APICallEvent {
  api: string;
  endpoint: string;
  success: boolean;
  duration: number;
  error?: string;
  timestamp: Date;
}

export interface AssessmentEvent {
  compound: string;
  ingredientCount: number;
  riskLevel: string;
  dataQuality: number;
  duration: number;
  timestamp: Date;
}

export interface UserActionEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: Date;
}

export interface AnalyticsConfig {
  maxEventAge: number;
  maxEvents: number;
}
