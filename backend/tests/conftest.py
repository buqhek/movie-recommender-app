"""Shared pytest fixtures for the movie recommender backend test suite."""
import pytest
import sqlite3
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def _apply_schema(db_path: str):
    """Create schema and seed sample movies into the test database."""
    schema_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'schema.sql')
    conn = sqlite3.connect(db_path)
    with open(schema_path, 'r') as f:
        conn.executescript(f.read())
    # Titles match the real movie_titles.txt format (with year suffix)
    sample_movies = [
        ('The Dark Knight (2008)',),
        ('Inception (2010)',),
        ('Interstellar (2014)',),
        ('The Matrix (1999)',),
        ('Pulp Fiction (1994)',),
    ]
    conn.executemany('INSERT INTO movies (title) VALUES (?)', sample_movies)
    conn.commit()
    conn.close()


@pytest.fixture(scope='session')
def app(tmp_path_factory):
    """
    Single Flask app for the entire test session.

    Blueprints register exactly once, which is what Flask requires.
    The DATABASE_PATH env var is set before any app import so the
    module-level Database singletons in models/user.py and routes/movies.py
    pick up the test path at import time.
    """
    db_path = str(tmp_path_factory.mktemp('db') / 'test.db')
    _apply_schema(db_path)

    # Set env var BEFORE importing the app so module-level Database()
    # singletons (in models/user.py and routes/movies.py) see this path.
    os.environ['DATABASE_PATH'] = db_path
    os.environ.setdefault('SECRET_KEY', 'test-secret-key')

    from app import create_app

    class TestingConfig:
        SECRET_KEY = 'test-secret-key'
        DATABASE_PATH = db_path
        SESSION_COOKIE_HTTPONLY = True
        SESSION_COOKIE_SECURE = False
        SESSION_COOKIE_SAMESITE = 'Lax'
        TESTING = True
        DEBUG = False

    application = create_app(config_class=TestingConfig)
    application.config['TESTING'] = True
    application.config['DATABASE_PATH'] = db_path

    return application


@pytest.fixture(scope='function', autouse=True)
def clean_users(app):
    """
    Wipe the users table before every test automatically.
    Movies are read-only in tests so they don't need resetting.
    """
    db_path = app.config['DATABASE_PATH']
    conn = sqlite3.connect(db_path)
    conn.execute('DELETE FROM users')
    conn.commit()
    conn.close()


@pytest.fixture(scope='function')
def client(app):
    """Fresh test client per test — new client means no leftover session cookies."""
    return app.test_client()


@pytest.fixture(scope='function')
def registered_user(client):
    """Pre-registers a test user and returns their credentials."""
    credentials = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'securepassword123',
    }
    client.post('/api/v1/auth/register', json=credentials)
    return credentials


@pytest.fixture(scope='function')
def logged_in_client(client, registered_user):
    """Test client with an active session for the pre-registered user."""
    client.post('/api/v1/auth/login', json={
        'username': registered_user['username'],
        'password': registered_user['password'],
    })
    return client
