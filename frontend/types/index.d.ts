export interface User {
  _id: string;
  name?: string;
  email: string;
  username: string;
  is_active: boolean;
  personal_goals?: string[];
  preferred_categories?: string[];
  onboarding_completed?: boolean;
  xp?: number;
  level?: number;
  badges?: any[];
  settings?: {
    insightFrequency?: "WEEKLY" | "DAILY" | "MONTHLY";
    analysisDepth?: "BASIC" | "ADVANCED" | "DEEP_ANALYSIS";
    habitReminders?: boolean;
    streakAlerts?: boolean;
    aiInsights?: boolean;
    notifications?: boolean;
  };
}

export interface UpdateSettingsPayload {
  insightFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  analysisDepth?: 'BASIC' | 'ADVANCED' | 'DEEP_ANALYSIS';
  habitReminders?: boolean;
  streakAlerts?: boolean;
  aiInsights?: boolean;
  notifications?: boolean;
}