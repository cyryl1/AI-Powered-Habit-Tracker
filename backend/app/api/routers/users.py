from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.schemas import LoginRequest, UserIn, UserOut, OnboardingData, UserSettingsUpdate
from app.core.security import PasswordHasher
from app.core.database import get_db
from app.core.config import settings
from app.services.auth import create_access_token
from datetime import timedelta
from typing import Annotated
from app.models.user import User, UserResponse, UserSettings
from app.services.auth import get_current_active_user, get_current_user
from bson import ObjectId


router = APIRouter(
    prefix="/api/v1/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)
password_hasher = PasswordHasher()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserIn, db: Annotated[any, Depends(get_db)]):
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    hashed_password = password_hasher.hash_password(user.password)
    new_user_data = {
        "email": user.email, 
        "username": user.username, 
        "hashed_password": hashed_password,
        "onboarding_completed": False
    }
    await db.users.insert_one(new_user_data)
    return UserOut(email=user.email, username=user.username)


@router.post("/login")
async def login_for_access_token(
    request: Request,
    response: Response,
    credentials: LoginRequest,
    db: Annotated[any, Depends(get_db)]
):
    # Find user in database
    user_in_db = await db.users.find_one({"username": credentials.username})
    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password"
        )
    
    # Verify password
    if not password_hasher.verify_password(credentials.password, user_in_db["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user_in_db["_id"])},
        expires_delta=access_token_expires
    )
    
    # Determine cookie settings based on environment
    is_production = settings.ENVIRONMENT == "production"
    
    # Set cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="none" if is_production else "lax",
        secure=True if is_production else False,
        max_age=int(access_token_expires.total_seconds()),
        path="/",
        domain=None,
    )
    
    return {"message": "Login successful"}

@router.post("/logout")
async def logout_user(
    response: Response,
    request: Request,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """
    Logout user by clearing the access_token cookie
    """
    # Determine cookie settings based on environment
    is_production = settings.ENVIRONMENT == "production"

    # Clear the access_token cookie
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="none" if is_production else "lax",
        secure=True if is_production else False
    )
    
    return {
        "message": "Successfully logged out",
        "success": True
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        is_active=current_user.is_active,
        name=current_user.name,
        personal_goals=current_user.personal_goals,
        preferred_categories=current_user.preferred_categories,
        onboarding_completed=current_user.onboarding_completed,
        settings=current_user.settings
    )

@router.get("/settings", response_model=UserSettings)
async def get_user_settings(current_user: Annotated[User, Depends(get_current_active_user)]):
    """
    Retrieve the current user's settings.
    """
    if not current_user.settings:
        # Return empty settings instead of hardcoded defaults
        return UserSettings()
    
    # Return actual settings from database
    return current_user.settings


@router.put("/update-settings", response_model=UserResponse)  # ✅ Changed from UserSettings
async def update_user_settings(
    settings_update: UserSettingsUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[any, Depends(get_db)]
):
    
    update_data = settings_update.model_dump(exclude_none=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    # Separate user-level updates from settings-level updates
    user_updates = {}
    settings_updates = {}
    
    for key, value in update_data.items():
        if key in ["name", "email"]:
            # These are top-level user fields
            user_updates[key] = value
        else:
            # These are settings fields - keep camelCase to match your DB
            settings_updates[f"settings.{key}"] = value
    
    # Combine both update operations
    all_updates = {**user_updates, **settings_updates}
    
    user_oid = ObjectId(current_user.id)
    result = await db.users.update_one(
        {"_id": user_oid},
        {"$set": all_updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # ✅ Return full user data with updated settings
    updated_user_doc = await db.users.find_one({"_id": user_oid})
    if not updated_user_doc:
        raise HTTPException(status_code=404, detail="User not found after update")
    
    # Handle settings properly
    settings_data = updated_user_doc.get("settings", {})
    actual_settings = {k: v for k, v in settings_data.items() 
                      if k in ["notifications", "aiInsights", "insightFrequency", 
                              "analysisDepth", "habitReminders", "streakAlerts"]}
    settings_obj = UserSettings(**actual_settings) if actual_settings else UserSettings()
    
    # ✅ Return complete user response
    return UserResponse(
        id=str(updated_user_doc["_id"]),
        email=updated_user_doc["email"],
        username=updated_user_doc["username"],
        is_active=updated_user_doc.get("is_active", True),
        name=updated_user_doc.get("name"),
        personal_goals=updated_user_doc.get("personal_goals"),
        preferred_categories=updated_user_doc.get("preferred_categories"),
        onboarding_completed=updated_user_doc.get("onboarding_completed", False),
        settings=settings_obj
    )

@router.post("/onboarding", response_model=UserResponse)
async def complete_onboarding(
    onboarding_data: OnboardingData, 
    current_user: Annotated[User, Depends(get_current_active_user)], 
    db: Annotated[any, Depends(get_db)]
):
    # Update user with onboarding data
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {
            "name": onboarding_data.name,
            "personal_goals": onboarding_data.personal_goals,
            "preferred_categories": onboarding_data.preferred_categories,
            "onboarding_completed": True
        }}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": ObjectId(current_user.id)})
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Handle settings properly
    settings_data = updated_user.get("settings")
    if settings_data:
        settings_obj = UserSettings(**{
            k: v for k, v in settings_data.items() 
            if k in ["notifications", "aiInsights", "insightFrequency", 
                    "analysisDepth", "habitReminders", "streakAlerts"]
        })
    else:
        settings_obj = UserSettings()
    
    return UserResponse(
        id=str(updated_user["_id"]),
        email=updated_user["email"],
        username=updated_user["username"],
        is_active=updated_user.get("is_active", True),
        name=updated_user.get("name"),
        personal_goals=updated_user.get("personal_goals"),
        preferred_categories=updated_user.get("preferred_categories"),
        onboarding_completed=updated_user.get("onboarding_completed", False),
        settings=settings_obj  # Always provide settings
    )