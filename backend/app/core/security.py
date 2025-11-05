from datetime import datetime, timedelta
from typing import Optional

from bson import ObjectId
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.database import get_db

from app.core.config import settings
from app.schemas.schemas import UserOut
from app.models.user import User

class PasswordHasher:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        # Bcrypt has a 72-byte limit, so we need to truncate the password
        # to avoid the "password cannot be longer than 72 bytes" error
        truncated_password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return self.pwd_context.hash(truncated_password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        # Apply the same truncation as in hash_password for consistency
        truncated_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return self.pwd_context.verify(truncated_password, hashed_password)


# Token related constants
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login", auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

# async def get_current_active_user(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     username = verify_token(token, credentials_exception)
#     # In a real application, you would fetch the user from the database here
#     # For now, we'll just return a dummy user with the username
#     user = UserOut(name=username, email=f"{username}@example.com", id="dummy_id")
#     if user is None:
#         raise credentials_exception
#     return user

async def get_token_from_cookie(request: Request) -> str:
    # Get token ONLY from cookies
    token = request.cookies.get("access_token")
    
    if not token:
        print("❌ No access_token cookie found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated - no access token cookie",
        )
    
    print(f"✅ Token found in cookie: {token[:20]}...")
    return token

async def get_current_user(token: str = Depends(get_token_from_cookie), db: any = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    
    print(f"🔍 Verifying token: {token[:20]}...")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")  # This should be the user ID
        
        print(f"📝 Token payload - user_id: {user_id}")
        
        if user_id is None:
            print("❌ No user_id in token payload")
            raise credentials_exception
        
        # Fetch the actual user from database
        user_data = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user_data:
            print("❌ User not found in database")
            raise credentials_exception
        
        print(f"✅ User found: {user_data['username']}")
        
        # Convert to User model
        user = User(
            id=str(user_data["_id"]),
            email=user_data["email"],
            username=user_data["username"],
            is_active=user_data.get("is_active", True),
            name=user_data.get("name"),
            personal_goals=user_data.get("personal_goals"),
            preferred_categories=user_data.get("preferred_categories"),
            onboarding_completed=user_data.get("onboarding_completed", False)
        )
        
        return user
        
    except JWTError as e:
        print(f"❌ JWT Error: {e}")
        raise credentials_exception

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user