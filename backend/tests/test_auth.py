"""
Tests for /api/v1/auth/* routes.

Covers: register, login, logout, /me, duplicate detection,
missing fields, and the @login_required decorator.
"""


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------

class TestRegister:
    URL = '/api/v1/auth/register'

    def test_register_success(self, client):
        """Valid registration returns 201 and a success message."""
        res = client.post(self.URL, json={
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123',
        })
        assert res.status_code == 201
        assert 'message' in res.get_json()

    def test_register_sets_session(self, client):
        """Successful registration logs the user in immediately."""
        with client.session_transaction() as sess:
            assert 'username' not in sess

        client.post(self.URL, json={
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123',
        })

        with client.session_transaction() as sess:
            assert sess.get('username') == 'newuser'

    def test_register_duplicate_username(self, client, registered_user):
        """Registering with an existing username returns 409."""
        res = client.post(self.URL, json={
            'username': registered_user['username'],
            'email': 'different@example.com',
            'password': 'password123',
        })
        assert res.status_code == 409
        assert 'error' in res.get_json()

    def test_register_duplicate_email(self, client, registered_user):
        """Registering with an existing email returns 409."""
        res = client.post(self.URL, json={
            'username': 'differentuser',
            'email': registered_user['email'],
            'password': 'password123',
        })
        assert res.status_code == 409

    def test_register_missing_username(self, client):
        """Missing username field returns 400."""
        res = client.post(self.URL, json={
            'email': 'test@example.com',
            'password': 'password123',
        })
        assert res.status_code == 400
        assert 'error' in res.get_json()

    def test_register_missing_email(self, client):
        """Missing email field returns 400."""
        res = client.post(self.URL, json={
            'username': 'testuser',
            'password': 'password123',
        })
        assert res.status_code == 400

    def test_register_missing_password(self, client):
        """Missing password field returns 400."""
        res = client.post(self.URL, json={
            'username': 'testuser',
            'email': 'test@example.com',
        })
        assert res.status_code == 400

    def test_register_no_body(self, client):
        """Request with no JSON body returns 400 or 415 (Flask rejects missing Content-Type)."""
        res = client.post(self.URL)
        assert res.status_code in (400, 415)


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

class TestLogin:
    URL = '/api/v1/auth/login'

    def test_login_success(self, client, registered_user):
        """Valid credentials return 200."""
        res = client.post(self.URL, json={
            'username': registered_user['username'],
            'password': registered_user['password'],
        })
        assert res.status_code == 200
        assert 'message' in res.get_json()

    def test_login_sets_session(self, client, registered_user):
        """Successful login writes username into the session."""
        client.post(self.URL, json={
            'username': registered_user['username'],
            'password': registered_user['password'],
        })
        with client.session_transaction() as sess:
            assert sess.get('username') == registered_user['username']

    def test_login_wrong_password(self, client, registered_user):
        """Wrong password returns 401 with a generic error message."""
        res = client.post(self.URL, json={
            'username': registered_user['username'],
            'password': 'wrongpassword',
        })
        assert res.status_code == 401
        # Should not leak whether username or password was wrong
        assert res.get_json()['error'] == 'Invalid username or password'

    def test_login_nonexistent_user(self, client):
        """Username that doesn't exist returns 401."""
        res = client.post(self.URL, json={
            'username': 'nobody',
            'password': 'password123',
        })
        assert res.status_code == 401

    def test_login_missing_fields(self, client):
        """Missing username or password returns 400."""
        res = client.post(self.URL, json={'username': 'testuser'})
        assert res.status_code == 400

    def test_login_no_body(self, client):
        """Request with no JSON body returns 400 or 415 (Flask rejects missing Content-Type)."""
        res = client.post(self.URL)
        assert res.status_code in (400, 415)


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------

class TestLogout:
    URL = '/api/v1/auth/logout'

    def test_logout_success(self, logged_in_client):
        """Logged-in user can log out and receives 200."""
        res = logged_in_client.post(self.URL)
        assert res.status_code == 200

    def test_logout_clears_session(self, logged_in_client):
        """After logout, session no longer contains username."""
        logged_in_client.post(self.URL)
        with logged_in_client.session_transaction() as sess:
            assert 'username' not in sess

    def test_logout_requires_auth(self, client):
        """Unauthenticated logout attempt returns 401."""
        res = client.post(self.URL)
        assert res.status_code == 401


# ---------------------------------------------------------------------------
# /me — get current user
# ---------------------------------------------------------------------------

class TestGetCurrentUser:
    URL = '/api/v1/auth/me'

    def test_me_returns_user_data(self, logged_in_client, registered_user):
        """Authenticated /me returns username and email."""
        res = logged_in_client.get(self.URL)
        assert res.status_code == 200
        data = res.get_json()
        assert data['username'] == registered_user['username']
        assert data['email'] == registered_user['email']

    def test_me_does_not_return_password(self, logged_in_client):
        """Password hash must never appear in the /me response."""
        res = logged_in_client.get(self.URL)
        assert 'password' not in res.get_json()

    def test_me_requires_auth(self, client):
        """Unauthenticated /me returns 401."""
        res = client.get(self.URL)
        assert res.status_code == 401


# ---------------------------------------------------------------------------
# login_required decorator — edge cases
# ---------------------------------------------------------------------------

class TestLoginRequired:
    def test_protected_route_without_session_returns_401(self, client):
        """Any @login_required route blocks unauthenticated requests."""
        res = client.post('/api/v1/auth/logout')
        assert res.status_code == 401
        assert res.get_json()['error'] == 'Authentication required'

    def test_session_persists_across_requests(self, client, registered_user):
        """Session cookie keeps the user logged in across multiple requests."""
        client.post('/api/v1/auth/login', json={
            'username': registered_user['username'],
            'password': registered_user['password'],
        })
        # Second request — session should still be valid
        res = client.get('/api/v1/auth/me')
        assert res.status_code == 200
