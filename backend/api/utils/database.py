"""Holds all database helper functions for the backend server."""
import os
import sqlite3


class Database:
    def __init__(self,  db_path):
        self.db_path = db_path

    def get_conn(self):
        """Connect to database. Returns a connection conn."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row  # Modifying the connection so
                                            # results come back as 
                                            # dictionary-like objets
            return conn

        except sqlite3.Error as e:
            print(f"An error occurred with connecting to the database: {e}")
            raise
        
    
    def query(self, sql_command, params=None):
        """
        Executes a SELECT query and returns a list of dictionaries.

        Args:
            `sql_command`: SQL query string with ? placeholders
            `params`: Tuple of values to substitute into the query

        Example: 
            db.query('SELECT * FROM USERS WHERE username = ?', ('hektor',))
        """
        conn = self.get_conn()
        try:    
            cursor = conn.cursor()
            if params:
                cursor.execute(sql_command, params)
            else:
                cursor.execute(sql_command)
            
            rows = cursor.fetchall()
            results = []
            
            for row in rows:
                results.append(dict(row))
            return results
        
        finally:
            conn.close()
    
    def execute(self, sql_command, params=None):
        """
        Executes INSERT/UPDATE/DELETE command

        Args:
            `sql_command`: SQL query with ? placeholders
            `params`: Tuple of values to substitute into the query
        
        Example:
            db.execute('INSERT INTO users VALUES (?,?,?)', ('hektor','hektor@email.com','password',))\n
            db.execute('UPDATE users SET username = ?, email = ?', ('hektor','hektor@email.com',))\n
            db.execute('DELETE FROM users WHERE username = ?', ('hektor',))
        """
        conn = self.get_conn()
        try:
            cursor = conn.cursor()
            
            if params:
                cursor.execute(sql_command,params)
            else:
                cursor.execute(sql_command)
            
            conn.commit()
            return cursor.rowcount
        
        except sqlite3.Error as e:
            conn.rollback()
            print(f'Database error: {e}')
            raise
        
        finally:
            conn.close()
