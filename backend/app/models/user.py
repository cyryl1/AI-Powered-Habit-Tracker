from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List

class UserSettings(BaseModel):
    notifications: Optional[bool] = None
    aiInsights: Optional[bool] = None
    insightFrequency: Optional[str] = None
    analysisDepth: Optional[str] = None
    habitReminders: Optional[bool] = None
    streakAlerts: Optional[bool] = None

    model_config = ConfigDict(populate_by_name=True)

class Badge(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    earned_at: str

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: EmailStr
    username: str
    hashed_password: Optional[str] = None
    is_active: bool = True
    name: Optional[str] = None
    personal_goals: Optional[List[str]] = None
    preferred_categories: Optional[List[str]] = None
    onboarding_completed: bool = False
    settings: UserSettings = Field(default_factory=UserSettings)  # Use default_factory
    xp: int = 0
    level: int = 1
    badges: List[Badge] = []

    model_config = ConfigDict(
        populate_by_name=True
    )

class UserResponse(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: EmailStr
    username: str
    is_active: bool = True
    name: Optional[str] = None
    personal_goals: Optional[List[str]] = None
    preferred_categories: Optional[List[str]] = None
    onboarding_completed: bool = False
    settings: UserSettings = Field(default_factory=UserSettings)  # Use default_factory
    xp: int = 0
    level: int = 1
    badges: List[Badge] = []

    model_config = ConfigDict(
        populate_by_name=True
    )