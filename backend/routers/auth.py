from typing import Optional
from fastapi import APIRouter, Cookie
from fastapi.responses import JSONResponse
from backend.models import LoginRequest
from backend.auth import MOCK_TOKEN

router = APIRouter()

@router.post("/api/login")
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

@router.post("/api/logout")
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
