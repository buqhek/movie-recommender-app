import { useState } from "react";
// 1. Check if user is logged in with GET fetch
// 2. If logged out: user only sends POST request to website when selecting movies and applying a rating to a "temporary" user to make a recommendation
// 3. If logged in: user send POST request to website when selecting movies and applying a rating, and saves this rating with the user's data
 
function Query() {
  // const [movieInfo, setMovieInfo] = useState({});
  // const [movies, setMovies] = useState([{}]);
  // const [movieTitle, setMovieTitle]

  // const searchMovie = async () => {
  //   try{
  //     const response = await fetch(`/search?q=${movieTitle}`)

  //     if (response.ok) {
  //       const data = await response.json();
  //       setMovieInfo(data);
  //     } else {
  //       // Do something else
  //     }
  //   }
  // };


  return <h1>TODO: Build Query Page</h1>;
}

export default Query;
