import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv() # This loads your connection string from a .env file

# Get the URL from your .env file
MONGODB_URL = os.getenv("MONGODB_URL")

# Create the client and point to a specific database
client = AsyncIOMotorClient(MONGODB_URL)
db = client.academic_nlp_db  # This creates/uses a database named 'academic_nlp_db'

async def check_db_connection():
    try:
        # The 'ping' command is cheap and confirms we are connected
        await client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas!")
    except Exception as e:
        print(f"❌ Could not connect to MongoDB: {e}")