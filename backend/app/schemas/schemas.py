from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from app.models.user import UserSettings

class UserIn(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserOut(BaseModel):
    email: EmailStr
    username: str
    name: Optional[str] = None
    onboarding_completed: bool = False
    settings: Optional[UserSettings] = None

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


class UserSettingsUpdate(BaseModel):
    notifications: Optional[bool] = None
    aiInsights: Optional[bool] = None
    insightFrequency: Optional[str] = None
    analysisDepth: Optional[str] = None
    habitReminders: Optional[bool] = None
    streakAlerts: Optional[bool] = None