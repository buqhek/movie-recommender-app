"""Holds all the api endpoints for the user for the backend."""
from flask import Blueprint, jsonify, session
from api.utils.auth import login_required
from api.models.user import delete_user


user_bp = Blueprint('user', __name__)

@user_bp.route('/account', methods=['GET'])
def get_account():
    """Returns account information."""
    return jsonify(
        {'message': 'GET account endpoint - not yet implemented.'}
    ), 504


@user_bp.route('/delete', methods=['POST'])
@login_required
def delete_account():
    """Deletes the account."""
    
    delete_user(session['username'])
    session.clear()
    
    return jsonify(
        {'message': 'Account deleted.'}
    ), 204