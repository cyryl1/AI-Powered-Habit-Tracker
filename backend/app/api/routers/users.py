from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.schemas import UserIn, UserOut, OnboardingData
from app.core.security import PasswordHasher
from app.core.database import get_db
from app.services.auth import create_access_token
from datetime import timedelta
from typing import Annotated
from app.models.user import User, UserResponse
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
async def login_for_access_token(request: Request, response: Response, db: Annotated[any, Depends(get_db)], form_data: OAuth2PasswordRequestForm = Depends()):
    user_in_db = await db.users.find_one({"username": form_data.username})
    if not user_in_db:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")
    if not password_hasher.verify_password(form_data.password, user_in_db["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")
    # access_token_expires = timedelta(minutes=10080)
    access_token_expires = timedelta(minutes=30)
    
    # Store the user's ID in the JWT payload
    access_token = create_access_token(
        data={"sub": str(user_in_db["_id"])},
        expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=request.url.scheme == "https",
        max_age=access_token_expires.total_seconds(),
        path="/",
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
    # Clear the access_token cookie
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
        secure=request.url.scheme == "https"
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
        onboarding_completed=current_user.onboarding_completed
    )

@router.post("/onboarding", response_model=UserResponse)
async def complete_onboarding(onboarding_data: OnboardingData, current_user: Annotated[User, Depends(get_current_active_user)], db: Annotated[any, Depends(get_db)]):
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

    print(f"Updated user fields: {list(updated_user.keys())}")
    
    return UserResponse(
        id=str(updated_user["_id"]),
        email=updated_user["email"],
        username=updated_user["username"],
        is_active=updated_user.get("is_active", True),
        name=updated_user.get("name"),
        personal_goals=updated_user.get("personal_goals"),
        preferred_categories=updated_user.get("preferred_categories"),
        onboarding_completed=updated_user.get("onboarding_completed", False)
    )
