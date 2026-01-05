from datetime import datetime, timezone
from typing import List, Optional
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

from backend.models import (
    Project,
    ProjectType,
    StorageType,
    ProjectVisibility,
    CreateProjectBody,
    UpdateProjectBody,
    User,
    UserRegister,
    UserUpdate,
)

# Load environment variables
load_dotenv()

# MongoDB Connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

# Initialize MongoDB client
client = MongoClient(MONGODB_URI)
db = client.get_database()  # Uses database from URI
users_collection = db["users"]

# Create unique index on email for users
users_collection.create_index("email", unique=True)

def now_iso() -> str:
    return (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )

# ==================== User Database Operations ====================

def create_user(user_data: dict) -> Optional[User]:
    """Create a new user in the database"""
    try:
        now = now_iso()
        user_doc = {
            "username": user_data["username"],
            "email": user_data["email"],
            "hashed_password": user_data["hashed_password"],
            "created_at": now,
            "updated_at": now,
        }
        result = users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        return User(
            id=str(user_doc["_id"]),
            username=user_doc["username"],
            email=user_doc["email"],
            hashed_password=user_doc["hashed_password"],
            created_at=user_doc["created_at"],
            updated_at=user_doc["updated_at"],
        )
    except DuplicateKeyError:
        return None  # Email already exists

def find_user_by_email(email: str) -> Optional[User]:
    """Find a user by email"""
    user_doc = users_collection.find_one({"email": email})
    if not user_doc:
        return None
    return User(
        id=str(user_doc["_id"]),
        username=user_doc["username"],
        email=user_doc["email"],
        hashed_password=user_doc["hashed_password"],
        created_at=user_doc["created_at"],
        updated_at=user_doc["updated_at"],
    )

def find_user_by_id(user_id: str) -> Optional[User]:
    """Find a user by ID"""
    try:
        user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user_doc:
            return None
        return User(
            id=str(user_doc["_id"]),
            username=user_doc["username"],
            email=user_doc["email"],
            hashed_password=user_doc["hashed_password"],
            created_at=user_doc["created_at"],
            updated_at=user_doc["updated_at"],
        )
    except Exception:
        return None

def update_user(user_id: str, update_data: dict) -> Optional[User]:
    """Update user information"""
    try:
        update_data["updated_at"] = now_iso()
        result = users_collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
            return_document=True
        )
        if not result:
            return None
        return User(
            id=str(result["_id"]),
            username=result["username"],
            email=result["email"],
            hashed_password=result["hashed_password"],
            created_at=result["created_at"],
            updated_at=result["updated_at"],
        )
    except Exception:
        return None

def list_all_users() -> List[User]:
    """List all users (for admin purposes)"""
    users = []
    for user_doc in users_collection.find():
        users.append(User(
            id=str(user_doc["_id"]),
            username=user_doc["username"],
            email=user_doc["email"],
            hashed_password=user_doc["hashed_password"],
            created_at=user_doc["created_at"],
            updated_at=user_doc["updated_at"],
        ))
    return users

# ==================== Project Database Operations (In-Memory for now) ====================

next_project_id = 3
projects: List[Project] = [
    Project(
        id=1,
        name="ConceptFlow Demo",
        description="Example mind-map project",
        projectType=ProjectType.mindmap,
        storageType=StorageType.cloud,
        visibility=ProjectVisibility.private,
        color="#228be6",
        createdAt="2025-12-01T09:00:00Z",
        updatedAt="2025-12-01T10:00:00Z",
        lastOpenedAt="2025-12-02T07:30:00Z",
    ),
    Project(
        id=2,
        name="Brainstorm - New Features",
        description="Rough ideas for next release",
        projectType=ProjectType.canvas,
        storageType=StorageType.cloud,
        visibility=ProjectVisibility.private,
        color="#40c057",
        createdAt="2025-12-02T08:00:00Z",
        updatedAt="2025-12-02T09:15:00Z",
        lastOpenedAt="2025-12-03T05:45:00Z",
    ),
]

def list_projects() -> List[Project]:
    return sorted(projects, key=lambda p: p.updatedAt, reverse=True)

def list_recent_projects(limit: int = 5) -> List[Project]:
    return sorted(
        projects,
        key=lambda p: p.lastOpenedAt or "",
        reverse=True,
    )[:limit]

def find_project(project_id: int) -> Optional[Project]:
    for project in projects:
        if project.id == project_id:
            return project
    return None

def touch_project_last_opened(project_id: int) -> Optional[Project]:
    project = find_project(project_id)
    if project:
        project.lastOpenedAt = now_iso()
    return project

def create_project_data(data: CreateProjectBody) -> Project:
    global next_project_id
    now = now_iso()
    project = Project(
        id=next_project_id,
        name=data.name.strip(),
        description=data.description,
        projectType=data.projectType,
        storageType=data.storageType,
        visibility=data.visibility,
        color=data.color,
        createdAt=now,
        updatedAt=now,
        lastOpenedAt=now,
    )
    next_project_id += 1
    projects.append(project)
    return project

def update_project_data(project_id: int, data: UpdateProjectBody) -> Optional[Project]:
    project = find_project(project_id)
    if not project:
        return None

    if data.name is not None:
        project.name = data.name.strip()
    if data.description is not None:
        project.description = data.description
    if data.projectType is not None:
        project.projectType = data.projectType
    if data.storageType is not None:
        project.storageType = data.storageType
    if data.visibility is not None:
        project.visibility = data.visibility
    if data.color is not None:
        project.color = data.color

    project.updatedAt = now_iso()
    return project

def delete_project_data(project_id: int) -> bool:
    global projects
    before = len(projects)
    projects = [p for p in projects if p.id != project_id]
    return len(projects) < before
