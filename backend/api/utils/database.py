"""Holds all database helper functions for the backend server."""
import sqlite3


class Database:
    def __init__(self,  db_path: str):
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
        
    
    def query(self, sql_command: str, params=None):
        """
        Executes a SELECT query and returns a list of dictionaries.

        Args:
            sql_command: SQL query string with ? placeholders
            params: Tuple of values to substitute into the query

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


    def execute(self, sql_command: str, params=None):
        """
        Executes INSERT/UPDATE/DELETE command

        Args:
            sql_command: SQL query with ? placeholders
            params: Tuple of values to substitute into the query
        
        Returns:
            Number of rows affected

        Example:
            db.execute('INSERT INTO users VALUES (?,?,?)',
            ('hektor','hektor@email.com','password',))
            
            db.execute('UPDATE users SET username = ?, email = ?',
            ('hektor','hektor@email.com',))
            
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


    def execute_many(self, sql_command: str, params_list):
        """
        Executes the same sql command (INSERT/UPDATE/DELETE) multiple times
        with different parameters

        Args:
            sql_command: SQL query with ? placeholders
            params: Tuple of values to substitute into the query
        
        Returns:
            Number of rows affected
        
            Example:
                users = [
                ('user1', 'user1@email.com', 'pass1'),
                ('user2', 'user2@email.com', 'pass2'),
                ('user3', 'user3@email.com', 'pass3'),
            ]
            db.execute_many('INSERT INTO users VALUES (?, ?, ?)', users)
        """
        conn = self.get_conn()
        try:
            cursor = conn.cursor()
            
            cursor.executemany(sql_command, params_list)
            
            conn.commit()
            return cursor.rowcount
        
        except sqlite3.Error as e:
            conn.rollback()
            print(f'Database error: {e}')
            raise
        
        finally:
            conn.close()