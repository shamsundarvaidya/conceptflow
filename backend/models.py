from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class ProjectType(str, Enum):
    mindmap = "mindmap"
    canvas = "canvas"
    kanban = "kanban"
    flowchart = "flowchart"
    whiteboard = "whiteboard"

class StorageType(str, Enum):
    local = "local"
    cloud = "cloud"


# User Models
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: str
    updated_at: str

class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    hashed_password: str
    created_at: str
    updated_at: str

# Legacy login model for backward compatibility
class LoginRequest(BaseModel):
    email: str
    password: str

class Project(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    projectType: ProjectType
    storageType: StorageType
    
    color: Optional[str] = None
    createdAt: str
    updatedAt: str
    lastOpenedAt: Optional[str] = None

class CreateProjectBody(BaseModel):
    name: str
    description: Optional[str] = None
    projectType: ProjectType
    storageType: StorageType
    
    color: Optional[str] = None

class UpdateProjectBody(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    projectType: Optional[ProjectType] = None
    storageType: Optional[StorageType] = None
    
    color: Optional[str] = None
