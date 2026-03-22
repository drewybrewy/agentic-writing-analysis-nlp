from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key to sign our tokens (Keep this in .env later!)
SECRET_KEY = "SUPER_SECRET_ACADEMIC_KEY" 
ALGORITHM = "HS256"

import bcrypt

def hash_password(password: str) -> str:
    # 1. Convert string to bytes
    password_bytes = password.encode('utf-8')
    
    # 2. Generate a salt and hash it
    # salt is a random string added to the password to make it unique
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # 3. Return as a string so it can be stored in MongoDB
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Convert both to bytes to compare
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60) # Token lasts 1 hour
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)