import os
import google.generativeai as genai
from datetime import datetime, timedelta
from typing import List, Optional

from beanie import PydanticObjectId

from app.core.database import get_db
from app.models.habit import Habit
from app.models.user import User
from app.services.email import send_email

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

async def generate_and_send_ai_insights():
    """Generates and sends AI insights to users who have enabled them."""
    db = await get_db()
    model = genai.GenerativeModel('gemini-2.5-flash')

    users_cursor = db.users.find({"settings.aiInsights": True, "settings.notifications": True})
    async for user_dict in users_cursor:
        try:
            # user_dict is a plain dict from MongoDB, not a User model instance
            user_id = str(user_dict["_id"])
            user_name = user_dict.get("name", "User")
            user_email = user_dict.get("email")
            
            if not user_email:
                continue
            
            # Get user's habits
            user_habits = await db.habits.find({"user_id": user_id}).to_list(length=None)
            habit_names = ", ".join([habit.get("name", "Unnamed") for habit in user_habits]) if user_habits else "no habits yet"

            prompt = f"Generate a short, encouraging and personalized AI insight for a user named {user_name}. " \
                     f"The user's habits include: {habit_names}. Focus on motivation and progress. " \
                     f"Format the insight as a friendly, concise message."
            response = model.generate_content(prompt)
            insight_content = f"Hello {user_name},\n\nHere's your weekly AI Insight:\n\n{response.text}\n\nKeep up the great work!"
            await send_email(
                subject="Your Weekly AI Insight",
                recipient=user_email,
                body=insight_content
            )
        except Exception as e:
            print(f"Error sending AI insight to user: {e}")
