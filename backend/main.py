from fastapi import FastAPI
from app.api.routers import users, habits
from app.core.database import lifespan
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://172.29.32.1:3000",
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
app.include_router(habits.ai_router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI backend!"}