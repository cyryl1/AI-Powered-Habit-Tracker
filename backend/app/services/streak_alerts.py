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
    async for user in users_cursor:
        user_habits = await db.habits.find({"user_id": str(user.id)}).to_list()
        for habit in user_habits:
            if habit.streak > 0 and habit.streak % 7 == 0:
                subject = f"Streak Alert for {habit.name}!"
                body = f"Congratulations {user.name}! You've reached a {habit.streak}-day streak for your habit: {habit.name}! Keep up the great work!"
                await send_email(
                    subject=subject,
                    recipient=user.email,
                    body=body
                )
