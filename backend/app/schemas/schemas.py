from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from app.models.user import UserSettings

class LoginRequest(BaseModel):
    username: str
    password: str

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

class GoalBreakdownRequest(BaseModel):
    goal: str
    duration: Optional[str] = "daily"

class SuggestedHabit(BaseModel):
    name: str
    description: str
    frequency: str
    reason: str

class GoalBreakdownResponse(BaseModel):
    habits: List[SuggestedHabit]
    advice: str

class ScheduleSuggestion(BaseModel):
    habit_id: str
    habit_name: str
    current_time: Optional[str]
    suggested_time: str
    reason: str

class ScheduleResponse(BaseModel):
    suggestions: List[ScheduleSuggestion]

class Badge(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    earned_at: str

class HabitCompletionResponse(BaseModel):
    habit: Any # Avoid circular import, or use a forward ref if possible. Using Any for simplicity here or import Habit schema
    xp_gained: int
    new_level: Optional[int] = None
    new_badges: List[Badge] = []