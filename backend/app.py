from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
import sqlite3
import requests

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_bp)

# Connect to SQLite
# def get_db_connection():
#     conn = sqlite3.connect('database.db')
#     conn.row_factory = sqlite3.Row
#     return conn

# Example route: proxying a request to another API
# @app.route('/api/data', methods=['GET'])
# def get_data():
#     response = requests.get("https://existing-api.com/data")
#     data = response.json()
#     return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
