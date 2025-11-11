from fastapi import FastAPI
from app.api.routers import users, habits, ai
from app.core.database import lifespan
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi_utils.tasks import repeat_every
from app.services.reminders import check_and_send_reminders
from app.services.ai_insights import generate_and_send_ai_insights
from app.services.streak_alerts import check_and_send_streak_alerts

app = FastAPI(lifespan=lifespan)

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

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://172.29.32.1:3000",
    "https://ai-powered-habit-tracker-neon.vercel.app/",
    "https://ai-powered-habit-tracker.onrender.com",
]

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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