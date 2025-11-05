from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List

class UserSettings(BaseModel):
    insightFrequency: Optional[str] = "WEEKLY"
    analysisDepth: Optional[str] = "BASIC"
    habitReminders: Optional[bool] = True
    streakAlerts: Optional[bool] = True
    aiInsights: Optional[bool] = True
    notifications: Optional[bool] = True

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
    settings: UserSettings = UserSettings() # Add settings field

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
    settings: UserSettings = UserSettings() # Add settings field

    model_config = ConfigDict(
        populate_by_name=True
    )