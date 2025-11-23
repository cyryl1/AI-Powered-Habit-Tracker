from datetime import datetime, timedelta
from typing import List, Optional

from beanie import PydanticObjectId

from app.core.database import get_db
from app.models.habit import Habit
from app.models.user import User
from app.services.email import send_email

async def check_and_send_streak_alerts():
    """Checks for streak milestones and sends alerts to users who have enabled them."""
    db = await get_db()

    users_cursor = db.users.find({"settings.streakAlerts": True, "settings.notifications": True})
    async for user_dict in users_cursor:
        try:
            # user_dict is a plain dict from MongoDB, not a User model instance
            user_id = str(user_dict["_id"])
            user_name = user_dict.get("name", "User")
            user_email = user_dict.get("email")
            
            if not user_email:
                continue
            
            user_habits = await db.habits.find({"user_id": user_id}).to_list(length=None)
            for habit in user_habits:
                streak = habit.get("streak", 0)
                if streak > 0 and streak % 7 == 0:
                    habit_name = habit.get("name", "Your habit")
                    subject = f"Streak Alert for {habit_name}!"
                    body = f"Congratulations {user_name}! You've reached a {streak}-day streak for your habit: {habit_name}! Keep up the great work!"
                    await send_email(
                        subject=subject,
                        recipient=user_email,
                        body=body
                    )
        except Exception as e:
            print(f"Error sending streak alert to user: {e}")
