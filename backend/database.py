from datetime import datetime, timezone
from typing import List, Optional
from backend.models import (
    Project,
    ProjectType,
    StorageType,
    ProjectVisibility,
    CreateProjectBody,
    UpdateProjectBody,
)

def now_iso() -> str:
    return (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )

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
