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
    model = genai.GenerativeModel('gemini-2.5-flash') # Using gemini-pro as gemini-2.5-flash is not directly available via genai.GenerativeModel

    users_cursor = db.users.find({"settings.aiInsights": True})
    async for user in users_cursor:
        if user and user.settings.notifications and user.settings.aiInsights:
            # In a real scenario, you'd generate personalized insights here
            # For now, we'll use a generic prompt.
            user_habits = await db.habits.find({"user_id": user.id}).to_list()
            habit_names = ", ".join([habit.name for habit in user_habits]) if user_habits else "no habits yet"

            prompt = f"Generate a short, encouraging and personalized AI insight for a user named {user.name}. " \
                     f"The user's habits include: {habit_names}. Focus on motivation and progress. " \
                     f"Format the insight as a friendly, concise message."
            response = model.generate_content(prompt)
            insight_content = f"Hello {user.name},\n\nHere's your weekly AI Insight:\n\n{response.text}\n\nKeep up the great work!"
            await send_email(
                subject="Your Weekly AI Insight",
                recipient=user.email,
                body=insight_content
            )
