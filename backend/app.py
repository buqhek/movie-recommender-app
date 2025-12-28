from flask import Flask
from config import DevelopmentConfig
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

    # Test route
    @app.route('/')
    def hello():
        return {'message': 'Movie Recommender API is running!'}

    @app.route('/api/v1/health')
    def health_check():
        return {'status': 'healthy', 'database': app.config['DATABASE_PATH']}


    return app

if __name__ == '__main__':
    app = create_app()

    app.run()