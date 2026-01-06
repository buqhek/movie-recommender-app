"""Holds all functions, models, and routes for the api repository."""
from flask import Blueprint


# Main API blueprint that will be connected to the app
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

def register_routes(api_blueprint):
    """Register all route blueprints."""
    from api.routes.auth import auth_bp
    from api.routes.user import user_bp

    # Import and register route blueprints here
    api_blueprint.register_blueprint(auth_bp, url_prefix='/auth')
    api_blueprint.register_blueprint(user_bp, url_prefix='/user')