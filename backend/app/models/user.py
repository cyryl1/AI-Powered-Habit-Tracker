from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema, handler):
        field_schema.update(type="string")

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    email: EmailStr
    username: str
    hashed_password: str
    is_active: bool = True

# For API responses (without password)
class UserResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    email: EmailStr
    username: str
    is_active: bool = True

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}