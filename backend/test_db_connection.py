"""
Test script to verify MongoDB connection and user operations
Run with: python test_db_connection.py
"""

import sys
from backend.database import (
    create_user,
    find_user_by_email,
    find_user_by_id,
    update_user,
    list_all_users,
)
from backend.auth import hash_password

def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    print("=" * 50)
    print("Testing MongoDB Connection")
    print("=" * 50)
    
    try:
        # Test 1: List all users
        print("\n1. Listing all users...")
        users = list_all_users()
        print(f"   Found {len(users)} users")
        
        # Test 2: Create a test user
        print("\n2. Creating a test user...")
        test_email = "testuser@example.com"
        
        # Check if user already exists
        existing_user = find_user_by_email(test_email)
        if existing_user:
            print(f"   User with email {test_email} already exists")
            test_user = existing_user
        else:
            test_user_data = {
                "username": "Test User",
                "email": test_email,
                "hashed_password": hash_password("testpassword123"),
            }
            test_user = create_user(test_user_data)
            if test_user:
                print(f"   ✓ User created successfully")
                print(f"     ID: {test_user.id}")
                print(f"     Username: {test_user.username}")
                print(f"     Email: {test_user.email}")
            else:
                print(f"   ✗ Failed to create user (email may already exist)")
                return
        
        # Test 3: Find user by email
        print("\n3. Finding user by email...")
        found_user = find_user_by_email(test_email)
        if found_user:
            print(f"   ✓ User found: {found_user.username}")
        else:
            print(f"   ✗ User not found")
        
        # Test 4: Find user by ID
        print("\n4. Finding user by ID...")
        found_user_by_id = find_user_by_id(test_user.id)
        if found_user_by_id:
            print(f"   ✓ User found: {found_user_by_id.username}")
        else:
            print(f"   ✗ User not found")
        
        # Test 5: Update user
        print("\n5. Updating user...")
        update_data = {"username": "Updated Test User"}
        updated_user = update_user(test_user.id, update_data)
        if updated_user:
            print(f"   ✓ User updated successfully")
            print(f"     New username: {updated_user.username}")
        else:
            print(f"   ✗ Failed to update user")
        
        print("\n" + "=" * 50)
        print("All tests completed successfully!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    test_mongodb_connection()
