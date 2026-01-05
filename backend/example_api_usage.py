"""
Example usage of the User API endpoints
This script demonstrates how to interact with the user authentication endpoints.
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# Create a session to maintain cookies
session = requests.Session()

def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print(f"{'='*60}")

def main():
    print("\n🚀 User API Example Usage\n")
    
    # 1. Register a new user
    print("\n1️⃣  Registering a new user...")
    register_data = {
        "username": "johndoe",
        "email": "john.doe@example.com",
        "password": "securepass123"
    }
    response = session.post(f"{BASE_URL}/api/register", json=register_data)
    print_response("REGISTER", response)
    
    if response.status_code != 201:
        print("\n⚠️  Registration failed. User might already exist.")
        print("Trying to login instead...")
        
        # 2. Login with existing user
        login_data = {
            "email": "john.doe@example.com",
            "password": "securepass123"
        }
        response = session.post(f"{BASE_URL}/api/login", json=login_data)
        print_response("LOGIN", response)
    
    # 3. Get current user info
    print("\n2️⃣  Getting current user information...")
    response = session.get(f"{BASE_URL}/api/user/me")
    print_response("GET CURRENT USER", response)
    
    # 4. Update user information
    print("\n3️⃣  Updating user information...")
    update_data = {
        "username": "John Doe Updated"
    }
    response = session.put(f"{BASE_URL}/api/user/me", json=update_data)
    print_response("UPDATE USER", response)
    
    # 5. Get updated user info
    print("\n4️⃣  Verifying update...")
    response = session.get(f"{BASE_URL}/api/user/me")
    print_response("GET UPDATED USER", response)
    
    # 6. Logout
    print("\n5️⃣  Logging out...")
    response = session.post(f"{BASE_URL}/api/logout")
    print_response("LOGOUT", response)
    
    # 7. Try to access protected endpoint after logout
    print("\n6️⃣  Trying to access protected endpoint after logout...")
    response = session.get(f"{BASE_URL}/api/user/me")
    print_response("GET USER (should fail)", response)
    
    print("\n✅ Example completed!")

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to the API server.")
        print("Please make sure the server is running:")
        print("  python -m backend.main")
        print("\nOr with uvicorn:")
        print("  uvicorn backend.main:app --reload")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
