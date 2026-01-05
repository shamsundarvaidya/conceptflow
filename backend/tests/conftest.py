import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import db

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(autouse=True)
def cleanup_test_user():
    """Clean up the test user before and after tests"""
    test_email = "test@example.com"
    db.users.delete_one({"email": test_email})
    yield
    db.users.delete_one({"email": test_email})
