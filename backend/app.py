"""The backend server app."""
from flask import Flask
from flask_cors import CORS
from config import DevelopmentConfig
from api import api_bp, register_routes
import sqlite3
import os


def init_db(database_path):
    """Initialize database if it doesn't exist."""
    if not os.path.exists(database_path):
        # Make db
        conn = sqlite3.connect(database_path)
        with open('data/schema.sql', 'r') as f:
            conn.executescript(f.read())
        conn.commit()
        conn.close()
        print(f"Database initialized at {database_path}")
    else:
        print(f"Database already exists at {database_path}")


def create_app(config_class=DevelopmentConfig):
    """Creates the flask server."""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize Database
    init_db(app.config['DATABASE_PATH'])

    # Register all routes through blueprints
    register_routes(api_bp)
    app.register_blueprint(api_bp)

    # Enable CORS
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()