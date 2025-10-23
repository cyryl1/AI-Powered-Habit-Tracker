from pydantic import BaseModel, EmailStr
from typing import List, Optional

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