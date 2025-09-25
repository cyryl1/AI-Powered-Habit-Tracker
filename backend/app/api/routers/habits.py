from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List
from app.models.habit import Habit, HabitUpdate, HabitCreate
from app.services.auth import get_current_active_user # Corrected import path
from app.core.database import get_db
from app.models.user import User
from bson import ObjectId
from datetime import datetime

router = APIRouter(
    prefix="/api/v1/habits",
    tags=["habits"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=Habit, status_code=status.HTTP_201_CREATED)
async def create_habit(habit: HabitCreate, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    habit_data = habit.model_dump()
    habit_data["user_id"] = str(current_user.id)
    habit_data["created_at"] = datetime.utcnow()
    habit_data["updated_at"] = datetime.utcnow()
    result = await db.habits.insert_one(habit_data)
    created_habit = await db.habits.find_one({"_id": result.inserted_id})
    return Habit(**created_habit)

@router.get("/", response_model=list[Habit])
async def get_all_habits(current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    habits = list(await db.habits.find({"user_id": str(current_user.id)}))
    return [Habit(**habit) for habit in habits]

@router.get("/{habit_id}", response_model=Habit)
async def get_habit_by_id(habit_id: str, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    habit = await db.habits.find_one({"_id": ObjectId(habit_id), "user_id": str(current_user.id)})
    if habit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    return Habit(**habit)

@router.put("/{habit_id}", response_model=Habit)
async def update_habit(habit_id: str, habit: HabitUpdate, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    existing_habit = await db.habits.find_one({"_id": ObjectId(habit_id), "user_id": str(current_user.id)})
    if existing_habit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    
    update_data = habit.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    await db.habits.update_one({"_id": ObjectId(habit_id)}, {"$set": update_data})
    updated_habit = await db.habits.find_one({"_id": ObjectId(habit_id)})
    if updated_habit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found after update")
    return Habit(**updated_habit)

@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(habit_id: str, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    result = await db.habits.delete_one({"_id": ObjectId(habit_id), "user_id": str(current_user.id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    return