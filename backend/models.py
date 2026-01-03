from enum import Enum
from typing import Optional
from pydantic import BaseModel

class ProjectType(str, Enum):
    mindmap = "mindmap"
    canvas = "canvas"
    kanban = "kanban"
    flowchart = "flowchart"
    whiteboard = "whiteboard"

class StorageType(str, Enum):
    local = "local"
    cloud = "cloud"

class ProjectVisibility(str, Enum):
    private = "private"
    public = "public"

class LoginRequest(BaseModel):
    email: str
    password: str

class Project(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    projectType: ProjectType
    storageType: StorageType
    visibility: ProjectVisibility
    color: Optional[str] = None
    createdAt: str
    updatedAt: str
    lastOpenedAt: Optional[str] = None

class CreateProjectBody(BaseModel):
    name: str
    description: Optional[str] = None
    projectType: ProjectType
    storageType: StorageType
    visibility: ProjectVisibility
    color: Optional[str] = None

class UpdateProjectBody(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    projectType: Optional[ProjectType] = None
    storageType: Optional[StorageType] = None
    visibility: Optional[ProjectVisibility] = None
    color: Optional[str] = None
