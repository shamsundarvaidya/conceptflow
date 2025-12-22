from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from fastapi import Cookie, FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel


MOCK_TOKEN = "mock-jwt-token-123"


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


app = FastAPI()


def now_iso() -> str:
    return (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )


def unauthorized_response() -> JSONResponse:
    return JSONResponse({"message": "Unauthorized"}, status_code=401)


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


def create_project(data: CreateProjectBody) -> Project:
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


def update_project(project_id: int, data: UpdateProjectBody) -> Optional[Project]:
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


def delete_project(project_id: int) -> bool:
    global projects
    before = len(projects)
    projects = [p for p in projects if p.id != project_id]
    return len(projects) < before


def validate_auth(token: Optional[str]) -> bool:
    return token == MOCK_TOKEN


@app.post("/api/login")
def login(payload: LoginRequest, token: Optional[str] = Cookie(default=None)):
    if payload.email != "test@mail.com" or payload.password != "test123":
        return JSONResponse({"message": "Invalid email or password"}, status_code=401)

    response = JSONResponse(
        {"id": 1, "name": "Mock User", "email": payload.email}, status_code=200
    )
    response.set_cookie(
        key="token",
        value=MOCK_TOKEN,
        max_age=3600,
        path="/",
        secure=True,
        httponly=True,
        samesite="strict",
    )
    return response


@app.post("/api/logout")
def logout():
    response = JSONResponse(None, status_code=200)
    response.set_cookie(
        key="token",
        value="",
        max_age=0,
        path="/",
        secure=True,
        httponly=True,
        samesite="strict",
    )
    return response


@app.get("/api/projects")
def get_projects(token: Optional[str] = Cookie(default=None)):
    if not validate_auth(token):
        return unauthorized_response()
    return JSONResponse([p.model_dump() for p in list_projects()], status_code=200)


@app.get("/api/projects/recent")
def get_recent_projects(token: Optional[str] = Cookie(default=None)):
    if not validate_auth(token):
        return unauthorized_response()
    return JSONResponse([p.model_dump() for p in list_recent_projects()], status_code=200)


@app.get("/api/projects/{project_id}")
def get_project(project_id: int, token: Optional[str] = Cookie(default=None)):
    if not validate_auth(token):
        return unauthorized_response()

    project = touch_project_last_opened(project_id)
    if not project:
        return JSONResponse({"message": "Project not found"}, status_code=404)
    return JSONResponse(project.model_dump(), status_code=200)


@app.post("/api/projects")
def create_project_endpoint(body: CreateProjectBody, token: Optional[str] = Cookie(default=None)):
    if not validate_auth(token):
        return unauthorized_response()

    if not body.name or not body.name.strip():
        return JSONResponse({"message": "Project name is required"}, status_code=400)

    project = create_project(body)
    return JSONResponse(project.model_dump(), status_code=201)


@app.put("/api/projects/{project_id}")
def update_project_endpoint(
    project_id: int, body: UpdateProjectBody, token: Optional[str] = Cookie(default=None)
):
    if not validate_auth(token):
        return unauthorized_response()

    project = update_project(project_id, body)
    if not project:
        return JSONResponse({"message": "Project not found"}, status_code=404)

    return JSONResponse(project.model_dump(), status_code=200)


@app.delete("/api/projects/{project_id}")
def delete_project_endpoint(project_id: int, token: Optional[str] = Cookie(default=None)):
    if not validate_auth(token):
        return unauthorized_response()

    removed = delete_project(project_id)
    if not removed:
        return JSONResponse({"message": "Project not found"}, status_code=404)

    return JSONResponse({"message": "Project deleted"}, status_code=200)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)
