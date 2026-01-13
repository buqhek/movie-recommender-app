import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { ChangeEvent } from "react";

function MovieSearchBar() {
  const {isLoggedIn} = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([""]);
  const [loading, setLoading] = useState(false);

  const fetchMovieSuggestions = async () => {
    setLoading(true); // used to display loading bar
    try {
      const response = await fetch(`/api/v1/movies/search?q=${encodeURIComponent(searchValue)}`);
      if (response.ok){
        const data = await response.json();
        setSuggestions(data);
        console.log(data);
      }
    } catch {
      setSuggestions(['no movies']); // No titles found
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    fetchMovieSuggestions();
  };

  const testMovies = async () => {
    const response = await fetch('/api/v1/movies/test');
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  };

  if (!isLoggedIn) {
    // Make guest account to be able to search properly
  } else {
    // Regular search
  }
  return (
    <>
      <div className="position-relavite">
        <div className="input-group mb-3">
            <input type="text" 
            className="form-control" 
            value={searchValue} 
            onChange={ handleSearchChange } 
            placeholder="Movie Title" 
            aria-label="Movie Title" 
            aria-describedby="button-addon2" />
            
            <button 
            className="btn btn-outline-secondary" 
            type="button"
            onClick={testMovies}
            id="button-addon2">Submit</button>
        </div>

      {/* Put in drop down here */}
      {/* asdf */}
      </div>
      {/* Loading circle */}
      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </>
  )
};

export default MovieSearchBar;
