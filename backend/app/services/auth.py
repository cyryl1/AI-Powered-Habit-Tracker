from datetime import datetime, timedelta
from typing import Annotated

from fastapi import Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings
from app.models.user import User, UserResponse, UserSettings
from app.core.database import get_db
from bson import ObjectId


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

async def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        print("DEBUG: No access_token cookie found.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    print(f"DEBUG: Token found in cookie: {token[:10]}...") # Print first 10 chars for brevity
    return token

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(get_token_from_cookie), db = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        print(f"DEBUG: Decoding JWT with SECRET_KEY: {settings.SECRET_KEY[:5]}... and ALGORITHM: {settings.ALGORITHM}")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        print(f"DEBUG: Decoded payload: {payload}, user_id: {user_id}")
        if user_id is None:
            print("DEBUG: user_id is None in JWT payload.")
            raise credentials_exception
    except JWTError as e:
        print(f"DEBUG: JWTError during decoding: {e}")
        raise credentials_exception
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        print(f"DEBUG: User with ID {user_id} not found in database.")
        raise credentials_exception
    print(f"DEBUG: User found: {user.get('username')}")

    # Convert settings data to UserSettings object if it exists
    if "settings" in user and user["settings"]:
        # Filter out name and email from settings since they don't belong there
        settings_data = {k: v for k, v in user["settings"].items() 
                        if k in ["notifications", "aiInsights", "insightFrequency", 
                                "analysisDepth", "habitReminders", "streakAlerts"]}
        settings_obj = UserSettings(**settings_data)
    else:
        # Create default settings for new users
        settings_obj = UserSettings()  # ✅ THIS IS THE FIX!
    # Ensure the _id is passed as 'id' to the User model
    user_obj = User(
        id=str(user["_id"]),
        email=user["email"],
        username=user["username"],
        hashed_password=user["hashed_password"],
        is_active=user.get("is_active", True),
        name=user.get("name"),
        personal_goals=user.get("personal_goals"),
        preferred_categories=user.get("preferred_categories"),
        onboarding_completed=user.get("onboarding_completed", False),
        settings=settings_obj  # ← THIS IS THE MISSING LINE!
    )
    
    return user_obj

async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user