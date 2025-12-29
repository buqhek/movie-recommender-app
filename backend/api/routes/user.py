from flask import Blueprint, jsonify

user_bp = Blueprint('users', __name__)

@user_bp.route('/account', methods=['GET'])
def get_account():
    """Returns account information."""
    return jsonify({'message': 'GET account endpoint - not yet implemented.'}), 504

@user_bp.route('/account', methods=['POST'])
def modify_account():
    """Modifies the account's email, username, or password."""
    return jsonify({'message': 'Modify account endpoint - not yet implemented.'}), 504