import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import type { ChangeEvent } from "react";

interface Movie {
  id: number;
  title: string;
}

function MovieSearchBar() {
  const {isLoggedIn} = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const timerSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const fetchMovieSuggestions = async (query: string) => {
    setLoading(true); // used to display loading bar
    try {
      const response = await fetch(`/api/v1/movies/search?q=${encodeURIComponent(query)}`);
      if (response.ok){
        const data: Movie[] = await response.json();
        setSuggestions(data);
        console.log(data);
      }
    } catch {
      setSuggestions([]); // No titles found
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e:ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (timerSearchRef.current) clearTimeout(timerSearchRef.current);
    timerSearchRef.current = setTimeout(() => {
      fetchMovieSuggestions(value);
    }, 300);
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
      {suggestions.length > 0 && searchValue !== "" && (
        <ul className="list-group">
          {suggestions.map((movie) => (
            <li key={movie.id} className="list-group-item list-group-item-action">
              {movie.title}
            </li>
          ))}
        </ul>
      )}

      {/* asdf */}
      </div>
      {/* Loading circle */}
      {/* {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )} */}
    </>
  )
};

export default MovieSearchBar;
