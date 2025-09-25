from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

# Assuming you have the PyObjectId class defined in your models directory
from app.models.user import PyObjectId

class Habit(BaseModel):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    name: str
    description: Optional[str] = None
    frequency: str
    created_at: Optional[datetime] = None  # Remove default factory
    updated_at: Optional[datetime] = None  # Remove default factory

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Drink Water",
                "user_id": "65134241e3d34421b8c6a0c2",
                "description": "Drink 8 glasses of water daily",
                "frequency": "daily",
            }
        }
    )

class HabitCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    frequency: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Exercise",
                "description": "Go to the gym for 30 minutes",
                "frequency": "weekly",
            }
        }
    )

class HabitUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    frequency: Optional[str] = None