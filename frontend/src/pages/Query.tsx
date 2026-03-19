import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MovieSearchBar, { type Movie } from "../components/MovieSearchBar";
// 2. If logged out: user only sends POST request to website when selecting movies and applying a rating to a "temporary" user to make a recommendation
// 3. If logged in: user send POST request to website when selecting movies and applying a rating, and saves this rating with the user's data
interface RatedMovie {
  movie: Movie;
  rating: number;
}



function Query() {
  const { isLoggedIn, user } = useAuth();
  const [ ratedMovies, setRatedMovies ] = useState<RatedMovie[]>([]);
  
  const handleSelectMovie = (movie: Movie) => {
    console.log(movie)
    const newRatedMovie: RatedMovie = {
      movie: movie,
      rating: 0
    }
    setRatedMovies(prev => [...prev, newRatedMovie]);
  }

  return (
    <>
      <h1>TODO: Build Query Page</h1>
      {isLoggedIn ? (
        <>
          <h1>Hello, {user?.username}</h1>
          <p>Let's recommend some movies</p>
        </>
      ) : (
        <p>User is not logged in. Make guest user to hold recommended data.</p>
      )}
      <MovieSearchBar onSelectMovie={handleSelectMovie} />
      <div>
        <ul>
          {ratedMovies.map((ratedMovie) => (
            <li key={ratedMovie.movie.id}>
              {ratedMovie.movie.title} - {ratedMovie.rating}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Query;
