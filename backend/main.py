from fastapi import FastAPI
from app.api.routers import users, habits, ai
from app.core.database import lifespan
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi_utils.tasks import repeat_every
from app.services.reminders import check_and_send_reminders
from app.services.ai_insights import generate_and_send_ai_insights
from app.services.streak_alerts import check_and_send_streak_alerts
from app.core.config import settings
import asyncio

# Enhanced lifespan to include background tasks
@asynccontextmanager
async def app_lifespan(app: FastAPI):
    # Startup: Initialize database and start background tasks
    async with lifespan(app):
        print(f"Starting up in {settings.ENVIRONMENT} mode")
        
        # Start background tasks
        task1 = asyncio.create_task(schedule_reminders())
        task2 = asyncio.create_task(schedule_ai_insights())
        task3 = asyncio.create_task(schedule_streak_alerts())
        
        yield
        
        # Shutdown: Cancel background tasks
        task1.cancel()
        task2.cancel()
        task3.cancel()

async def schedule_reminders():
    """Background task for checking reminders every minute"""
    while True:
        try:
            await check_and_send_reminders()
        except Exception as e:
            print(f"Error in reminder task: {e}")
        await asyncio.sleep(60)  # 1 minute

async def schedule_ai_insights():
    """Background task for generating AI insights weekly"""
    while True:
        try:
            await generate_and_send_ai_insights()
        except Exception as e:
            print(f"Error in AI insights task: {e}")
        await asyncio.sleep(604800)  # 1 week

async def schedule_streak_alerts():
    """Background task for checking streak alerts daily"""
    while True:
        try:
            await check_and_send_streak_alerts()
        except Exception as e:
            print(f"Error in streak alerts task: {e}")
        await asyncio.sleep(86400)  # 1 day

app = FastAPI(lifespan=app_lifespan)

# Set up CORS
# origins = settings.BACKEND_CORS_ORIGINS

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*", # Allows all origins while supporting credentials
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router)
app.include_router(habits.router)
app.include_router(ai.router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI backend!"}