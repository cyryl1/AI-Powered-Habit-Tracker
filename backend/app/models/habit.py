from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class Habit(BaseModel):
    id: Optional[str] = None
    user_id: str
    name: str
    description: Optional[str] = None
    frequency: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    streak: int = 0
    last_completed: Optional[str] = None
    completion_history: List[str] = []

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "name": "Morning Meditation",
                "description": "10 minutes of mindfulness meditation",
                "frequency": "daily",
                "streak": 5,
                "last_completed": "2023-04-15"
            }
        }
    )

class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    frequency: str

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    frequency: Optional[str] = None