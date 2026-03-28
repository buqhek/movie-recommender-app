"""
Tests for the Database utility class (api/utils/database.py).

Tests the data layer directly — independent of Flask routes.
Uses a real temporary SQLite file so behaviour matches production exactly.
"""
import pytest
import sqlite3
import tempfile
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from api.utils.database import Database


@pytest.fixture
def db(tmp_path):
    """
    Provides a Database instance backed by a real temporary SQLite file
    with a minimal schema for testing.
    """
    db_path = str(tmp_path / 'test.db')
    conn = sqlite3.connect(db_path)
    conn.executescript("""
        CREATE TABLE users (
            username VARCHAR(20) PRIMARY KEY,
            email    VARCHAR(40) NOT NULL,
            password VARCHAR(256) NOT NULL
        );
        CREATE TABLE movies (
            title VARCHAR(60) PRIMARY KEY
        );
    """)
    conn.commit()
    conn.close()
    return Database(db_path)


# ---------------------------------------------------------------------------
# query()
# ---------------------------------------------------------------------------

class TestDatabaseQuery:
    def test_query_returns_list(self, db):
        """query() always returns a list, even when the table is empty."""
        result = db.query('SELECT * FROM users')
        assert isinstance(result, list)

    def test_query_empty_table(self, db):
        """query() returns an empty list when no rows match."""
        result = db.query('SELECT * FROM users WHERE username = ?', ('nobody',))
        assert result == []

    def test_query_returns_dicts(self, db):
        """Each row returned by query() is a plain dictionary."""
        db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        result = db.query('SELECT * FROM users')
        assert len(result) == 1
        assert isinstance(result[0], dict)

    def test_query_correct_values(self, db):
        """Returned dict values match what was inserted."""
        db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        result = db.query('SELECT * FROM users WHERE username = ?', ('hektor',))
        assert result[0]['username'] == 'hektor'
        assert result[0]['email'] == 'h@example.com'

    def test_query_multiple_rows(self, db):
        """query() returns all matching rows."""
        db.execute_many(
            'INSERT INTO movies VALUES (?)',
            [('Inception',), ('Interstellar',), ('The Matrix',)]
        )
        result = db.query('SELECT * FROM movies')
        assert len(result) == 3

    def test_query_with_like(self, db):
        """LIKE queries work and return only matching rows."""
        db.execute_many(
            'INSERT INTO movies VALUES (?)',
            [('Inception',), ('Interstellar',), ('The Matrix',)]
        )
        result = db.query('SELECT * FROM movies WHERE title LIKE ?', ('%Inter%',))
        assert len(result) == 1
        assert result[0]['title'] == 'Interstellar'


# ---------------------------------------------------------------------------
# execute()
# ---------------------------------------------------------------------------

class TestDatabaseExecute:
    def test_execute_insert(self, db):
        """execute() inserts a row and it's retrievable."""
        db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        result = db.query('SELECT * FROM users WHERE username = ?', ('hektor',))
        assert len(result) == 1

    def test_execute_returns_row_count(self, db):
        """execute() returns the number of rows affected."""
        rows = db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        assert rows == 1

    def test_execute_update(self, db):
        """execute() can update an existing row."""
        db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        db.execute(
            'UPDATE users SET email = ? WHERE username = ?',
            ('new@example.com', 'hektor')
        )
        result = db.query('SELECT * FROM users WHERE username = ?', ('hektor',))
        assert result[0]['email'] == 'new@example.com'

    def test_execute_delete(self, db):
        """execute() can delete a row."""
        db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        db.execute('DELETE FROM users WHERE username = ?', ('hektor',))
        result = db.query('SELECT * FROM users WHERE username = ?', ('hektor',))
        assert result == []

    def test_execute_integrity_error_raises(self, db):
        """Inserting a duplicate primary key raises sqlite3.IntegrityError."""
        db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        with pytest.raises(Exception):
            db.execute(
                'INSERT INTO users VALUES (?,?,?)',
                ('hektor', 'different@example.com', 'hashed2')
            )

    def test_execute_rolls_back_on_error(self, db):
        """Failed execute() rolls back — no partial data is written."""
        db.execute(
            'INSERT INTO users VALUES (?,?,?)',
            ('hektor', 'h@example.com', 'hashed')
        )
        try:
            db.execute(
                'INSERT INTO users VALUES (?,?,?)',
                ('hektor', 'other@example.com', 'hashed2')
            )
        except Exception:
            pass

        result = db.query('SELECT * FROM users')
        assert len(result) == 1  # Only original row, no partial insert


# ---------------------------------------------------------------------------
# execute_many()
# ---------------------------------------------------------------------------

class TestDatabaseExecuteMany:
    def test_execute_many_inserts_all_rows(self, db):
        """execute_many() inserts every row in the params list."""
        movies = [('Inception',), ('Interstellar',), ('The Matrix',)]
        db.execute_many('INSERT INTO movies VALUES (?)', movies)
        result = db.query('SELECT * FROM movies')
        assert len(result) == 3

    def test_execute_many_empty_list(self, db):
        """execute_many() with an empty list inserts nothing and doesn't crash."""
        db.execute_many('INSERT INTO movies VALUES (?)', [])
        result = db.query('SELECT * FROM movies')
        assert result == []
