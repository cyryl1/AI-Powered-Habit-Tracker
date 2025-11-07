from app.core.database import get_db
from app.services.email import send_email
from datetime import datetime, timedelta

async def check_and_send_reminders():
    db = await get_db()
    now = datetime.utcnow()
    # Find habits that have reminders enabled and are due for a reminder
    habits_cursor = db.habits.find({
        "reminder_enabled": True,
        "next_reminder_at": {"$lte": now}
    })
    async for habit in habits_cursor:
        user = await db.users.find_one({"_id": habit["user_id"]})
        if user and user.settings.notifications and user.settings.habitReminders:
            await send_email(
                subject=f"Reminder: {habit['name']}",
                recipients=[user["email"]],
                body=f"<p>Hi {user['name']},</p><p>This is a reminder to complete your habit: <strong>{habit['name']}</strong>.</p>"
            )
            # Update the next reminder time
            next_reminder_at = now + timedelta(days=1) # Assuming daily reminders for now
            await db.habits.update_one(
                {"_id": habit["_id"]},
                {"$set": {"next_reminder_at": next_reminder_at}}
            )