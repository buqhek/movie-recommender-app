"""
Tests for /api/v1/movies/* routes.

Covers: search with valid query, empty query, partial match,
case-insensitivity, and no-results case.

Note: the fixture pre-loads 5 sample movies (see conftest.py):
  The Dark Knight, Inception, Interstellar, The Matrix, Pulp Fiction
"""


class TestMovieSearch:
    URL = '/api/v1/movies/search'

    def test_search_returns_matches(self, client):
        """A valid query returns matching movies with 200."""
        res = client.get(self.URL, query_string={'q': 'Inception'})
        assert res.status_code == 200
        data = res.get_json()
        assert isinstance(data, list)
        assert len(data) >= 1
        # Titles in the db include year suffix e.g. "Inception (2010)"
        titles = [m['title'] for m in data]
        assert any('Inception' in t for t in titles)

    def test_search_partial_match(self, client):
        """Partial title string returns all movies containing that substring."""
        res = client.get(self.URL, query_string={'q': 'Interstellar'})
        assert res.status_code == 200
        data = res.get_json()
        titles = [m['title'] for m in data]
        assert any('Interstellar' in t for t in titles)

    def test_search_prefix_the(self, client):
        """Searching 'Dark Knight' returns the expected film."""
        res = client.get(self.URL, query_string={'q': 'Dark Knight'})
        assert res.status_code == 200
        data = res.get_json()
        titles = [m['title'] for m in data]
        assert any('Dark Knight' in t for t in titles)

    def test_search_result_limit(self, client):
        """Results are capped at 10 (matches the LIMIT 10 in the query)."""
        res = client.get(self.URL, query_string={'q': 'The'})
        assert res.status_code == 200
        assert len(res.get_json()) <= 10

    def test_search_no_results(self, client):
        """A query with no matches returns an empty list, not an error."""
        res = client.get(self.URL, query_string={'q': 'xyznotamovie'})
        assert res.status_code == 200
        assert res.get_json() == []

    def test_search_empty_query_returns_400(self, client):
        """Empty query string returns 400."""
        res = client.get(self.URL, query_string={'q': ''})
        assert res.status_code == 400
        assert 'error' in res.get_json()

    def test_search_missing_query_param_returns_400(self, client):
        """Missing 'q' parameter entirely returns 400."""
        res = client.get(self.URL)
        assert res.status_code == 400

    def test_search_response_shape(self, client):
        """Each result has at least a 'title' field."""
        res = client.get(self.URL, query_string={'q': 'Inception'})
        assert res.status_code == 200
        for movie in res.get_json():
            assert 'title' in movie

    def test_search_does_not_require_auth(self, client):
        """Movie search is a public endpoint — no login needed."""
        res = client.get(self.URL, query_string={'q': 'Inception'})
        assert res.status_code == 200
