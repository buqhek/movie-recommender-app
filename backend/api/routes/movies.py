"""Holds all the api endpoints for the movie queries for the backend."""
from flask import Blueprint, jsonify, session, request
from ..utils.database import Database
import os


movies_bp = Blueprint('movies', __name__)
db = Database(os.environ.get('DATABASE_PATH'))


@movies_bp.route('/search', methods = ['GET'])
def query_movies():
    movie_title = request.args.get('q', '').strip()

    if not movie_title:
        return jsonify({'error' : 'Movie does not exist in database'}), 400
    
    movie_info = db.query('SELECT * FROM movies WHERE title LIKE ?', (f'%{movie_title}%',))

    return jsonify(movie_info), 200

@movies_bp.route('/test', methods = ['GET'])
def test():
    """Checks all the current movie titles within the database."""
    all_titles = db.query('SELECT title FROM movies')

    return jsonify(all_titles), 200