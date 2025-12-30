"""Config for the backend server."""
from dotenv import load_dotenv
from datetime import timedelta
import os


# Load .env variables into os.environ
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # True for prod
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    TESTING = False  # True in testingConfig

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_PATH = os.environ.get('DATABASE_PATH')

# TODO: Add TestingConfig when testing

# TODO: Add ProductionConfig when deploying
