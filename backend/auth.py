from typing import Optional
from fastapi.responses import JSONResponse

MOCK_TOKEN = "mock-jwt-token-123"

def validate_auth(token: Optional[str]) -> bool:
    return token == MOCK_TOKEN

def unauthorized_response() -> JSONResponse:
    return JSONResponse({"message": "Unauthorized"}, status_code=401)
