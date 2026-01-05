from typing import Optional
from fastapi import APIRouter, Cookie
from fastapi.responses import JSONResponse
from backend.models import CreateProjectBody, UpdateProjectBody
from backend.auth import validate_auth, unauthorized_response
from backend.database import (
    list_projects,
    list_recent_projects,
    touch_project_last_opened,
    create_project_data,
    update_project_data,
    delete_project_data,
)

router = APIRouter()

MOCK_USER_ID = "695bd1422e22e41ad00f64fc"

@router.get("/api/projects")
def get_projects():
    # TEMPORARY: Auth removed for testing
    # if not validate_auth(token):
    #     return unauthorized_response()
    return JSONResponse([p.model_dump() for p in list_projects(MOCK_USER_ID)], status_code=200)

@router.get("/api/projects/recent")
def get_recent_projects():
    # TEMPORARY: Auth removed for testing
    return JSONResponse([p.model_dump() for p in list_recent_projects(MOCK_USER_ID)], status_code=200)

@router.get("/api/projects/{project_id}")
def get_project(project_id: str):
    # TEMPORARY: Auth removed for testing
    project = touch_project_last_opened(project_id)
    if not project:
        return JSONResponse({"message": "Project not found"}, status_code=404)
    return JSONResponse(project.model_dump(), status_code=200)

@router.post("/api/projects")
def create_project_endpoint(body: CreateProjectBody):
    # TEMPORARY: Auth removed for testing
    if not body.name or not body.name.strip():
        return JSONResponse({"message": "Project name is required"}, status_code=400)

    project = create_project_data(body, MOCK_USER_ID)
    return JSONResponse(project.model_dump(), status_code=201)

@router.put("/api/projects/{project_id}")
def update_project_endpoint(project_id: str, body: UpdateProjectBody):
    # TEMPORARY: Auth removed for testing
    project = update_project_data(project_id, body)
    if not project:
        return JSONResponse({"message": "Project not found"}, status_code=404)

    return JSONResponse(project.model_dump(), status_code=200)

@router.delete("/api/projects/{project_id}")
def delete_project_endpoint(project_id: str):
    # TEMPORARY: Auth removed for testing
    removed = delete_project_data(project_id)
    if not removed:
        return JSONResponse({"message": "Project not found"}, status_code=404)

    return JSONResponse({"message": "Project deleted"}, status_code=200)
