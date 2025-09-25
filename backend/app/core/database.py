from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")
client = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    
    print("Connecting to MongoDB...")
    try:
        client = AsyncIOMotorClient(
            MONGO_DETAILS
        )
        # Test the connection
        await client.admin.command('ping')
        
        # Connect to your database - MongoDB Atlas will create it automatically
        db = client.habit_tracker  # This creates the database if it doesn't exist
        
        print("✅ Connected to MongoDB Atlas successfully!")
        print(f"📊 Using database: habit_tracker")
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise
    
    yield
    
    print("Closing MongoDB connection...")
    if client:
        client.close()

async def get_db():
    if db is None:
        raise Exception("Database not initialized")
    return db