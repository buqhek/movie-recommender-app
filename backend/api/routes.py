from flask import Blueprint, jsonify

api_bp = Blueprint("api", __name__)

@api_bp.route("/", methods=["GET"])
def index():
    return jsonify({"message": "API is working"})

