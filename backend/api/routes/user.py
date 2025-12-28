from flask import Blueprint, jsonify, request

user_bp = Blueprint('users', __name__, url_prefix='/users')

@user_bp.route('/signup', methods=['POST'])
def signup():
    
    return

@user_bp.route('/login', methods=['POST'])
def login():
    return

@user_bp.route('/account', methods=['GET'])
def get_account():
    return

@user_bp.route('/account', methods=['POST'])
def modify_account():
    return