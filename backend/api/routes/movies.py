"""Holds all the api endpoints for the movie queries for the backend."""
from flask import Blueprint, jsonify, session
from ..utils.database import Database


movies_bp = Blueprint('movies', __name__)

@movies_bp.route('/query', methods = ['POST'])
def query_movies():
    # TODO: Build movie query endpoint that takes in a POST
    # request with a user query, and default number of returned movies