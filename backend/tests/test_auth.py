import pytest
from backend.database import db
from backend.auth import hash_password

def test_register_user(client):
    """Test user registration"""
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = client.post("/api/register", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["username"] == payload["username"]
    assert data["user"]["email"] == payload["email"]
    assert "token" in response.cookies

def test_register_duplicate_email(client):
    """Test registration with an existing email"""
    # Create an existing user
    db.users.insert_one({
        "username": "existing",
        "email": "test@example.com",
        "hashed_password": hash_password("password"),
        "created_at": "2026-01-05T00:00:00Z",
        "updated_at": "2026-01-05T00:00:00Z"
    })
    
    payload = {
        "username": "newuser",
        "email": "test@example.com",
        "password": "newpassword"
    }
    
    response = client.post("/api/register", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client):
    """Test successful login"""
    # Create a user to login
    db.users.insert_one({
        "username": "loginuser",
        "email": "test@example.com",
        "hashed_password": hash_password("testpassword123"),
        "created_at": "2026-01-05T00:00:00Z",
        "updated_at": "2026-01-05T00:00:00Z"
    })
    
    payload = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = client.post("/api/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == payload["email"]
    assert "token" in response.cookies

def test_login_invalid_credentials(client):
    """Test login with wrong password"""
    db.users.insert_one({
        "username": "loginuser",
        "email": "test@example.com",
        "hashed_password": hash_password("correct_password"),
        "created_at": "2026-01-05T00:00:00Z",
        "updated_at": "2026-01-05T00:00:00Z"
    })
    
    payload = {
        "email": "test@example.com",
        "password": "wrong_password"
    }
    
    response = client.post("/api/login", json=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_logout(client):
    """Test logout clears the cookie"""
    response = client.post("/api/logout")
    assert response.status_code == 200
    # Check that the token cookie is empty
    assert response.cookies.get("token") == ""
