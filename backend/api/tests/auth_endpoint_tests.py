import requests

BASE_URL = 'http://127.0.0.1:5000/api/v1/auth'
session = requests.Session()  # Automatically handles cookies

# Register
r = session.post(f'{BASE_URL}/register', json={
    'username': 'bob',
    'email': 'bob@email.com',
    'password': 'pass123'
})
print('Register:', r.status_code, r.json())
try:
    assert r.status_code, 201
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Check /me (should work - auto logged in)
r = session.get(f'{BASE_URL}/me')
print('/me after register:', r.status_code, r.json())
try:
    assert r.status_code, 200
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Logout
r = session.post(f'{BASE_URL}/logout')
print('Logout:', r.status_code, r.json())
try:
    assert r.status_code, 200
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Check /me (should fail)
r = session.get(f'{BASE_URL}/me')
print('/me after logout:', r.status_code, r.json())
try:
    assert r.status_code, 401
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Login
r = session.post(f'{BASE_URL}/login', json={
    'username': 'bob',
    'password': 'pass123'
})
print('Login:', r.status_code, r.json())
try:
    assert r.status_code, 200
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Check /me (should work again)
r = session.get(f'{BASE_URL}/me')
print('/me after login:', r.status_code, r.json())
try:
    assert r.status_code, 200
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Logout
r = session.post(f'{BASE_URL}/logout')
print('Logout:', r.status_code, r.json())
try:
    assert r.status_code, 200
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Register
r = session.post(f'{BASE_URL}/register', json={
    'username': 'bob',
    'email': 'bob@email.com',
    'password': 'pass123'
})
print('Register:', r.status_code, r.json())
try:
    assert r.status_code, 201
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)

# Check /me (should work again)
r = session.get(f'{BASE_URL}/me')
print('/me after login:', r.status_code, r.json())
try:
    assert r.status_code, 200
except AssertionError as e:
    print(f'ASSERTION ERROR: {e}')
    exit(1)