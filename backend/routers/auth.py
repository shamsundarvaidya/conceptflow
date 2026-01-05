from typing import Optional
from fastapi import APIRouter, Cookie, HTTPException
from fastapi.responses import JSONResponse
from backend.models import UserRegister, UserLogin, UserUpdate, UserResponse
from backend.database import (
    create_user,
    find_user_by_email,
    find_user_by_id,
    update_user,
)
from backend.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_user_id_from_token,
    MOCK_TOKEN,
)

router = APIRouter()

def user_to_response(user) -> UserResponse:
    """Convert User model to UserResponse"""
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )

@router.post("/api/register")
def register(payload: UserRegister):
    """Register a new user"""
    # Check if user already exists
    existing_user = find_user_by_email(payload.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password = hash_password(payload.password)
    
    # Create user
    user_data = {
        "username": payload.username,
        "email": payload.email,
        "hashed_password": hashed_password,
    }
    
    user = create_user(user_data)
    if not user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    # Create access token
    access_token = create_access_token({"user_id": user.id, "email": user.email})
    
    # Create response with user data
    response = JSONResponse(
        {
            "user": user_to_response(user).model_dump(),
            "message": "Registration successful"
        },
        status_code=201
    )
    
    # Set token in cookie
    response.set_cookie(
        key="token",
        value=access_token,
        max_age=86400,  # 24 hours
        path="/",
        secure=True,
        httponly=True,
        samesite="strict",
    )
    
    return response

@router.post("/api/login")
def login(payload: UserLogin, token: Optional[str] = Cookie(default=None)):
    """Login a user"""
    # Support legacy mock authentication
    if payload.email == "test@mail.com" and payload.password == "test123":
        response = JSONResponse(
            {"id": "mock-id", "name": "Mock User", "email": payload.email},
            status_code=200
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
    
    # Find user by email
    user = find_user_by_email(payload.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token({"user_id": user.id, "email": user.email})
    
    # Create response with user data
    response = JSONResponse(
        {
            "user": user_to_response(user).model_dump(),
            "message": "Login successful"
        },
        status_code=200
    )
    
    # Set token in cookie
    response.set_cookie(
        key="token",
        value=access_token,
        max_age=86400,  # 24 hours
        path="/",
        secure=True,
        httponly=True,
        samesite="strict",
    )
    
    return response

@router.post("/api/logout")
def logout():
    """Logout a user"""
    response = JSONResponse({"message": "Logout successful"}, status_code=200)
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

@router.get("/api/user/me")
def get_current_user(token: Optional[str] = Cookie(default=None)):
    """Get the current authenticated user"""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Support legacy mock token
    if token == MOCK_TOKEN:
        return JSONResponse(
            {"id": "mock-id", "username": "Mock User", "email": "test@mail.com"},
            status_code=200
        )
    
    # Get user ID from token
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Find user
    user = find_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_to_response(user)

@router.put("/api/user/me")
def update_current_user(
    payload: UserUpdate,
    token: Optional[str] = Cookie(default=None)
):
    """Update the current authenticated user"""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get user ID from token
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Prepare update data
    update_data = {}
    
    if payload.username is not None:
        update_data["username"] = payload.username
    
    if payload.email is not None:
        # Check if email is already taken by another user
        existing_user = find_user_by_email(payload.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        update_data["email"] = payload.email
    
    if payload.password is not None:
        # Hash the new password
        update_data["hashed_password"] = hash_password(payload.password)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Update user
    updated_user = update_user(user_id, update_data)
    if not updated_user:
        raise HTTPException(status_code=500, detail="Failed to update user")
    
    return user_to_response(updated_user)
