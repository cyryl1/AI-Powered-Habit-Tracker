from fastapi import APIRouter, HTTPException, status, Depends, Response # Import Response
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.schemas import UserIn, UserOut
from app.core.security import PasswordHasher
from app.core.database import get_db
from app.services.auth import create_access_token
from datetime import timedelta
from typing import Annotated
from app.models.user import User
from app.services.auth import get_current_active_user, get_current_user # Corrected import path

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
    new_user_data = {"email": user.email, "username": user.username, "hashed_password": hashed_password}
    await db.users.insert_one(new_user_data)
    return UserOut(email=user.email, username=user.username)

@router.post("/login")
async def login_for_access_token(response: Response, db: Annotated[any, Depends(get_db)], form_data: OAuth2PasswordRequestForm = Depends()):
    user_in_db = await db.users.find_one({"username": form_data.username})
    if not user_in_db:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")
    if not password_hasher.verify_password(form_data.password, user_in_db["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user_in_db["username"]},
        expires_delta=access_token_expires
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax", # Or "strict" depending on your needs
        secure=False, # Set to True in production with HTTPS
        max_age=access_token_expires.total_seconds(),
        path="/",
    )
    return {"message": "Login successful"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user