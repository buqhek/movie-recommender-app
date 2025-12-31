"""Authentication endpoints for the backend server."""
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import session, jsonify

def hash_password(password: str) -> str:
    """
    Hashes a password using werkzeug's hash function.

    Args:
        password; Plain text password.

    Returns:
        Hashed password.    
    """
    return generate_password_hash(password, method='pbkdf2:sha256')


def verify_password(password: str, password_hash: str) -> bool:
    """
    Compares hashed with non-hashed password to verify they are the same.

    Args:
        password: Plain text password to check.
        password_hash: Hashed password to compare against.

    Returns:
        True if the passwords match, false otherwise.
    """
    return check_password_hash(password_hash,password)


def login_required(f):
    """
    Custom decorator to protect routes that require authentication.
    
    Usage:
        @app.route('/protected')
        @login_required
        def protected_route():
            username = session['username']
            return jsonify({'message': f'Hello {username}'})
    """
    @wraps(f)  # Helper to preserve the decorator's metadata
    def decorated_function(*args, **kwargs):  # Syntax to unpack any args
        #  Actual authentication check we are running for this decorator
        if 'username' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function