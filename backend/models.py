from enum import Enum
from typing import List, Optional, Union, Literal
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

# --- Common Project Components ---

class Node(BaseModel):
    id: str
    text: str
    x: float
    y: float

class Edge(BaseModel):
    id: str
    source: str
    target: str

class KanbanTask(BaseModel):
    id: str
    title: str
    description: Optional[str] = None

class KanbanColumn(BaseModel):
    id: str
    title: str
    tasks: List[KanbanTask] = []

# --- User Models ---

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

# --- Polymorphic Project Models ---

class BaseProject(BaseModel):
    id: Optional[str] = None  # MongoDB ObjectId string or int for legacy
    name: str
    description: Optional[str] = None
    projectType: ProjectType
    storageType: StorageType
    createdBy: str  # User ID
    color: Optional[str] = None
    createdAt: str
    updatedAt: str
    lastOpenedAt: Optional[str] = None

class MindMapProject(BaseProject):
    projectType: Literal[ProjectType.mindmap] = ProjectType.mindmap
    nodes: List[Node] = []
    edges: List[Edge] = []

class KanbanProject(BaseProject):
    projectType: Literal[ProjectType.kanban] = ProjectType.kanban
    columns: List[KanbanColumn] = []

class GenericProject(BaseProject):
    # Fallback for flowchart, canvas, whiteboard until they have specific schemas
    pass

# Polymorphic Type for API responses and handling
AnyProject = Union[MindMapProject, KanbanProject, GenericProject]

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
    # For now, updating content (nodes, columns) might be handled via specific endpoints 
    # or fully-loaded project updates.
