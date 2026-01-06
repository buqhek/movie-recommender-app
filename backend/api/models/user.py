"""User model function declarations."""
import api.utils.database as utils
import os


db = utils.Database(os.environ.get('DATABASE_PATH'))

def create_user(username: str, email: str, password: str) -> dict:
    """
    Inserts a user in the database.
    
    Args:
        username: unique username (max 20 chars).
        email: user's email address (max 40 chars).
        password: user's password.

    Returns:
        Dictionary containing username and email of created user

    Raises:
        sqlite3.IntegrityError: If username or email already exists
        sqlite3.Error: For other database errors
    """
    db.execute(
        'INSERT INTO users VALUES (?,?,?)',
        (username,email,password,)
    )

    return {
            'username': username,
            'email': email
        }
        

def fetch_user_by_username(username: str) -> dict | None:
    """
    Selects a user from the db if the username exists. Returns user dict.
    
    Args:
        username: unique username (max 20 chars).

    Raises:
        sqlite3.Error: For database errors
    """
    user = db.query('SELECT * FROM users WHERE username = ?', (username,))
    return user[0] if user else None


def fetch_user_by_email(email: str) -> dict | None:
    """
    Selects a user from the db if the username exists. Returns user dict.
    
    Args:
        email: user's email address (max 40 chars).

    Raises:
        sqlite3.Error: For database errors    
    """
    user = db.query('SELECT * FROM users WHERE email = ?', (email,))
    return user[0] if user else None


def username_exists(username: str) -> bool:
    """Returns true if username exists within the database."""
    user = db.query('SELECT * FROM users WHERE username = ?', (username,))
    return len(user) > 0


def email_exists(email: str) -> bool:
    """Returns true if email exists within the database."""
    user = db.query('SELECT * FROM users WHERE email = ?', (email,))
    return len(user) > 0


def update_username(username: str, new_username: str) -> None:
    """Update user's username."""
    db.execute(
        'UPDATE users SET username = ? WHERE username = ?',
          (new_username, username,)
    )


def update_email(username: str, new_email: str) -> None:
    """Update user's email."""
    db.execute(
        'UPDATE users SET email = ? WHERE username = ?',
          (new_email, username,)
    )


def update_password(username: str, new_password: str) -> None:
    """Update user's password."""
    db.execute(
        'UPDATE users SET password = ? WHERE username = ?',
          (new_password, username,)
    )

def delete_user(username: str) -> None:
    """Delete the user based on their username."""
    db.execute(
        'DELETE FROM users WHERE username = ?',
        (username,)
    )