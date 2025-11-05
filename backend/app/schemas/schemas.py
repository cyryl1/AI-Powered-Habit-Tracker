from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class UserIn(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserOut(BaseModel):
    email: EmailStr
    username: str
    name: Optional[str] = None
    onboarding_completed: bool = False

class OnboardingData(BaseModel):
    name: str
    personal_goals: List[str]
    preferred_categories: List[str]

class ChatMessage(BaseModel):
    role: str
    content: str

class AnalyticsData(BaseModel):
    weeklyCompletions: List[int]
    habitDistribution: List[Dict[str, Any]]
    bestPerforming: List[Dict[str, Any]]
    performanceMetrics: Dict[str, Any]

class UserSettingsIn(BaseModel):
    notifications: Optional[bool] = True
    ai_insights: Optional[bool] = True
    dark_mode: Optional[bool] = True
    insight_frequency: Optional[str] = "WEEKLY"
    analysis_depth: Optional[str] = "BASIC"
    theme: Optional[str] = "CYBERPUNK"

class UserSettingsOut(BaseModel):
    notifications: bool
    ai_insights: bool
    dark_mode: bool
    insight_frequency: str
    analysis_depth: str
    theme: str

class UserSettingsUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    notifications: Optional[bool] = None
    aiInsights: Optional[bool] = None
    insightFrequency: Optional[str] = None
    analysisDepth: Optional[str] = None
    habitReminders: Optional[bool] = None
    streakAlerts: Optional[bool] = None

class UserOut(BaseModel):
    email: EmailStr
    username: str
    name: Optional[str] = None
    onboarding_completed: bool = False
    settings: Optional[UserSettingsOut] = None