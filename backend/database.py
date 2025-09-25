import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")
DATABASE_NAME = os.getenv("DATABASE_NAME")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_client = Database()

async def connect_to_mongo():
    db_client.client = AsyncIOMotorClient(MONGO_DETAILS)
    db_client.db = db_client.client[DATABASE_NAME]
    print("Connected to MongoDB!")

async def close_mongo_connection():
    db_client.client.close()
    print("Closed MongoDB connection.")