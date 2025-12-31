"""Holds the api endpoints for authentication for the backend server."""
from flask import Blueprint, jsonify, request, session
from api.utils.auth import hash_password, verify_password, login_required
from api.models.user import create_user, username_exists, email_exists, fetch_user_by_username
import sqlite3


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods = ['POST'])
def register():
    """Register a new user."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}),400
    
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    
    if not username or not email or not password:
        return jsonify(
            {'error': 'Username, email, and password are required'}
        ),400

    if email_exists(email):
        return jsonify(
            {'error': 'Email already in use'}
        ), 409  # Conflict
    
    if username_exists(username):
        return jsonify(
            {'error': 'Username already in use'}
        ), 409  # Conflict

    hashed_ps = hash_password(password)
    try:
        create_user(username, email, hashed_ps)
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username or email already exists'}), 409
    except sqlite3.Error:
        return jsonify({'error': 'Database error occurred'}), 500
    
    session['username'] = username

    return jsonify(
        {'message': 'User successfully registered'}
    ), 201


@auth_bp.route('/login', methods = ['POST'])
def login():
    """Login a returning user."""   
    # Check if user exists
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}),400
    
    password = data.get('password')
    username = data.get('username')
    
    if not username or not password:
        return jsonify(
            {'error': 'Username and password are required'}
        ),400
    
    user = fetch_user_by_username(username)
    if not user:
        return jsonify(
              {'error': 'Invalid username or password'}
        ), 401

    # Verify password is correct
    if not verify_password(password, user['password']):
        return jsonify(
              {'error': 'Invalid username or password'}
        ), 401

    session['username'] = username

    return jsonify(
        {'message': 'User successfuly logged in'}
    ), 200

@auth_bp.route('/logout', methods = ['POST'])
@login_required
def logout():
    """Logout a returning user."""
    session.clear()
    return jsonify(
        {'message': 'User signed out'}
    ), 200

@auth_bp.route('/me', methods = ['GET'])
@login_required
def get_current_user():
    """
    Get current logged-in user information.

    Returns:
        200: User data (username, email)
        401: Not authenticated (handled by @login_required)
        404: User session exists but user not found in database
    """
    username = session['username']
    user = fetch_user_by_username(username)

    if not user:
        # Edge case where DB doesn't have user but session does.
        # Result: clear session since DB no longer holds user
        session.clear()
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'username': user['username'],
        'email': user['email']
    }), 200