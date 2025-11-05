from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List, Dict, Any
from app.models.habit import Habit, HabitUpdate, HabitCreate
from app.services.auth import get_current_active_user
from app.core.database import get_db
from app.models.user import User
from bson import ObjectId
from datetime import datetime, timedelta

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
    habit_data["streak"] = 0
    habit_data["last_completed"] = None
    habit_data["completion_history"] = []

    if habit_data.get("reminder_enabled"):
        habit_data["next_reminder_at"] = datetime.utcnow() + timedelta(days=1)
    
    result = await db.habits.insert_one(habit_data)
    created_habit = await db.habits.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for response
    created_habit["id"] = str(created_habit["_id"])
    del created_habit["_id"]
    return Habit(**created_habit)

@router.get("/", response_model=List[Habit])
async def get_all_habits(current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    habits_cursor = db.habits.find({"user_id": str(current_user.id)})
    habits = await habits_cursor.to_list(length=None)
    
    # Convert ObjectId to string for each habit
    for habit in habits:
        habit["id"] = str(habit["_id"])
        del habit["_id"]
    
    return [Habit(**habit) for habit in habits]

@router.get("/{habit_id}", response_model=Habit)
async def get_habit_by_id(habit_id: str, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    try:
        habit = await db.habits.find_one({"_id": ObjectId(habit_id), "user_id": str(current_user.id)})
        if habit is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
        
        # Convert ObjectId to string
        habit["id"] = str(habit["_id"])
        del habit["_id"]
        return Habit(**habit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid habit ID")

@router.put("/{habit_id}", response_model=Habit)
async def update_habit(habit_id: str, habit: HabitUpdate, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    try:
        existing_habit = await db.habits.find_one({"_id": ObjectId(habit_id), "user_id": str(current_user.id)})
        if existing_habit is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
        
        update_data = habit.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()

        if "reminder_enabled" in update_data:
            if update_data["reminder_enabled"]:
                update_data["next_reminder_at"] = datetime.utcnow() + timedelta(days=1)
            else:
                update_data["next_reminder_at"] = None

        await db.habits.update_one({"_id": ObjectId(habit_id)}, {"$set": update_data})
        
        updated_habit = await db.habits.find_one({"_id": ObjectId(habit_id)})
        if updated_habit is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found after update")
        
        # Convert ObjectId to string
        updated_habit["id"] = str(updated_habit["_id"])
        del updated_habit["_id"]
        return Habit(**updated_habit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid habit ID")

@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(habit_id: str, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    try:
        result = await db.habits.delete_one({"_id": ObjectId(habit_id), "user_id": str(current_user.id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
        return
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid habit ID")

@router.post("/{habit_id}/complete")
async def complete_habit(habit_id: str, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    try:
        habit = await db.habits.find_one({"_id": ObjectId(habit_id), "user_id": str(current_user.id)})
        if habit is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
        
        today = datetime.utcnow().date()
        today_str = today.isoformat()
        
        # Check if already completed today
        if habit.get("last_completed") == today_str:
            return {"message": "Habit already completed today"}
        
        # Update streak
        streak = habit.get("streak", 0)
        last_completed = habit.get("last_completed")
        
        if last_completed:
            # Parse the date string safely
            try:
                # Handle both ISO format and other date string formats
                if 'T' in last_completed:
                    last_date = datetime.fromisoformat(last_completed.replace('Z', '+00:00')).date()
                else:
                    last_date = datetime.strptime(last_completed, '%Y-%m-%d').date()
                
                yesterday = today - timedelta(days=1)
                
                if last_date == yesterday:
                    # Consecutive day, increase streak
                    streak += 1
                elif last_date < yesterday:
                    # Streak broken, reset to 1
                    streak = 1
                # If last_date == today, we already returned above
            except (ValueError, AttributeError):
                # If date parsing fails, treat as first completion
                streak = 1
        else:
            # First completion
            streak = 1
        
        # Update completion history
        completion_history = habit.get("completion_history", [])
        completion_history.append(today_str)
        
        # Update the habit
        await db.habits.update_one(
            {"_id": ObjectId(habit_id)},
            {"$set": {
                "last_completed": today_str,
                "streak": streak,
                "completion_history": completion_history,
                "updated_at": datetime.utcnow()
            }}
        )
        
        updated_habit = await db.habits.find_one({"_id": ObjectId(habit_id)})
        # Convert ObjectId to string
        updated_habit["id"] = str(updated_habit["_id"])
        del updated_habit["_id"]
        return Habit(**updated_habit)
    except Exception as e:
        print(f"Error completing habit: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid habit ID")

@router.get("/stats/summary", response_model=Dict[str, Any])
async def get_habit_stats(current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    habits_cursor = db.habits.find({"user_id": str(current_user.id)})
    habits = await habits_cursor.to_list(length=None)
    
    today = datetime.utcnow().date().isoformat()
    
    total_habits = len(habits)
    completed_today = sum(1 for habit in habits if habit.get("last_completed") == today)
    highest_streak = max((habit.get("streak", 0) for habit in habits), default=0)
    
    # Calculate completion rate for the last 7 days
    completion_rate = 0
    if total_habits > 0:
        last_week = [(datetime.utcnow().date() - timedelta(days=i)).isoformat() for i in range(7)]
        completions = sum(
            1 for habit in habits 
            for day in last_week 
            if day in habit.get("completion_history", [])
        )
        possible_completions = total_habits * 7
        completion_rate = (completions / possible_completions) * 100 if possible_completions > 0 else 0
    
    return {
        "total_habits": total_habits,
        "completed_today": completed_today,
        "highest_streak": highest_streak,
        "completion_rate": round(completion_rate, 2)
    }

@router.get("/stats/detailed", response_model=Dict[str, Any])
async def get_detailed_habit_stats(current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
    habits_cursor = db.habits.find({"user_id": str(current_user.id)})
    habits = await habits_cursor.to_list(length=None)
    
    today = datetime.utcnow().date().isoformat()
    
    total_habits = len(habits)
    completed_today = sum(1 for habit in habits if habit.get("last_completed") == today)
    highest_streak = max((habit.get("streak", 0) for habit in habits), default=0)
    total_streaks = sum(habit.get("streak", 0) for habit in habits)
    average_streak = total_streaks / total_habits if total_habits > 0 else 0
    
    # Habit frequency distribution
    frequency_distribution = {}
    for habit in habits:
        freq = habit.get("frequency", "daily")
        frequency_distribution[freq] = frequency_distribution.get(freq, 0) + 1
    
    # Weekly completion trends
    last_week_dates = [(datetime.utcnow().date() - timedelta(days=i)).isoformat() for i in range(7)]
    weekly_completions = {}
    for date in last_week_dates:
        completions = sum(1 for habit in habits if date in habit.get("completion_history", []))
        weekly_completions[date] = completions
    
    return {
        "total_habits": total_habits,
        "completed_today": completed_today,
        "highest_streak": highest_streak,
        "average_streak": round(average_streak, 2),
        "total_completions": sum(len(habit.get("completion_history", [])) for habit in habits),
        "frequency_distribution": frequency_distribution,
        "weekly_completions": weekly_completions,
        "completion_rate": round((completed_today / total_habits * 100) if total_habits > 0 else 0, 2)
    }
