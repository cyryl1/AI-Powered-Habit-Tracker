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

app = FastAPI(lifespan=lifespan)

@app.on_event("startup")
async def startup_event():
    print(f"Starting up in {settings.ENVIRONMENT} mode")

@app.on_event("startup")
@repeat_every(seconds=60)  # 1 minute
async def schedule_reminders():
    await check_and_send_reminders()

@app.on_event("startup")
@repeat_every(seconds=604800)  # 1 week
async def schedule_ai_insights():
    await generate_and_send_ai_insights()

@app.on_event("startup")
@repeat_every(seconds=86400)  # 1 day
async def schedule_streak_alerts():
    await check_and_send_streak_alerts()

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