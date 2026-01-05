from datetime import datetime, timezone
from typing import List, Optional
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

from backend.models import (
    AnyProject,
    ProjectType,
    StorageType,
    CreateProjectBody,
    UpdateProjectBody,
    User,
    UserRegister,
    UserUpdate,
    MindMapProject,
    KanbanProject,
    GenericProject,
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
projects_collection = db["projects"]

# Create unique index on email for users
users_collection.create_index("email", unique=True)

def now_iso() -> str:
    return (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )

# ==================== User Database Operations ====================
# ... (User operations remain the same) ...
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

# ==================== Project Database Operations (MongoDB) ====================

def _doc_to_project(doc: dict) -> AnyProject:
    """Convert a MongoDB document to a polymorphic Project object"""
    doc["id"] = str(doc.pop("_id"))
    p_type = doc.get("projectType")
    
    if p_type == ProjectType.mindmap:
        return MindMapProject(**doc)
    elif p_type == ProjectType.kanban:
        return KanbanProject(**doc)
    else:
        return GenericProject(**doc)


#list_projects for the given user_id. If user_id is None, raise ValueError
def list_projects(user_id: str) -> List[AnyProject]:
    """List projects for a specific user"""
    if user_id is None:
        raise ValueError("user_id is required")
    
    docs = projects_collection.find({"createdBy": user_id}).sort("updatedAt", -1)
    return [_doc_to_project(doc) for doc in docs]

def list_recent_projects(user_id: str, limit: int = 5) -> List[AnyProject]:
    """List recent projects for a user"""
    docs = projects_collection.find({"createdBy": user_id}).sort("lastOpenedAt", -1).limit(limit)
    return [_doc_to_project(doc) for doc in docs]

def find_project(project_id: str) -> Optional[AnyProject]:
    """Find a project by ID"""
    try:
        doc = projects_collection.find_one({"_id": ObjectId(project_id)})
        if not doc:
            return None
        return _doc_to_project(doc)
    except Exception:
        return None

def touch_project_last_opened(project_id: str) -> Optional[AnyProject]:
    """Update the lastOpenedAt timestamp"""
    try:
        now = now_iso()
        result = projects_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": {"lastOpenedAt": now}},
            return_document=True
        )
        if not result:
            return None
        return _doc_to_project(result)
    except Exception:
        return None

def create_project_data(data: CreateProjectBody, user_id: str) -> AnyProject:
    """Create a new project in MongoDB"""
    now = now_iso()
    project_doc = data.model_dump()
    project_doc.update({
        "createdBy": user_id,
        "createdAt": now,
        "updatedAt": now,
        "lastOpenedAt": now,
    })
    
    # Initialize type-specific fields if not present
    if data.projectType == ProjectType.mindmap:
        project_doc.setdefault("nodes", [])
        project_doc.setdefault("edges", [])
    elif data.projectType == ProjectType.kanban:
        project_doc.setdefault("columns", [])

    result = projects_collection.insert_one(project_doc)
    project_doc["_id"] = result.inserted_id
    return _doc_to_project(project_doc)

def update_project_data(project_id: str, data: UpdateProjectBody) -> Optional[AnyProject]:
    """Update project metadata or content in MongoDB"""
    try:
        update_doc = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
        update_doc["updatedAt"] = now_iso()
        
        result = projects_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": update_doc},
            return_document=True
        )
        if not result:
            return None
        return _doc_to_project(result)
    except Exception:
        return None

def delete_project_data(project_id: str) -> bool:
    """Delete a project from MongoDB"""
    try:
        result = projects_collection.delete_one({"_id": ObjectId(project_id)})
        return result.deleted_count > 0
    except Exception:
        return False
