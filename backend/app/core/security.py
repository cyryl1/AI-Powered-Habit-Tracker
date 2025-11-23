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
from app.models.user import User, UserSettings

class PasswordHasher:
    def __init__(self):
        # Use bcrypt_sha256 which safely supports passwords longer than 72 bytes
        # by hashing with SHA256 before applying bcrypt. This avoids silent
        # truncation issues across different bcrypt backends in production.
        self.pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        """Hash a password. Uses bcrypt_sha256 to avoid the 72-byte bcrypt limit."""
        # Always pass a str to passlib; bcrypt_sha256 internally handles long inputs
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a stored hash."""
        return self.pwd_context.verify(plain_password, hashed_password)

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
        user_id: str = payload.get("sub")  # ✅ Now expects user_id
        if user_id is None:
            raise credentials_exception
        return user_id  # ✅ Returns user_id
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated - no access token cookie",
        )
    return token

async def get_current_user(token: str = Depends(get_token_from_cookie), db: any = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
        
        user_data = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user_data:
            raise credentials_exception
        
        # Handle settings - create default if not exists
        settings_data = user_data.get("settings")
        if settings_data:
            # Filter only valid UserSettings fields
            settings_obj = UserSettings(**{
                k: v for k, v in settings_data.items() 
                if k in ["notifications", "aiInsights", "insightFrequency", 
                        "analysisDepth", "habitReminders", "streakAlerts"]
            })
        else:
            # Create default settings
            settings_obj = UserSettings()
        
        user = User(
            id=str(user_data["_id"]),
            email=user_data["email"],
            username=user_data["username"],
            is_active=user_data.get("is_active", True),
            name=user_data.get("name"),
            personal_goals=user_data.get("personal_goals"),
            preferred_categories=user_data.get("preferred_categories"),
            onboarding_completed=user_data.get("onboarding_completed", False),
            settings=settings_obj  # Always provide settings
        )
        
        return user
        
    except JWTError as e:
        print(f"❌ JWT Error: {e}")
        raise credentials_exception

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user