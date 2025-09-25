from pydantic import BaseModel, EmailStr

class UserIn(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserOut(BaseModel):
    email: EmailStr
    username: str