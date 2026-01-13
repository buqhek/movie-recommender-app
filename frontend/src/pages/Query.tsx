import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MovieSearchBar from "../components/MovieSearchBar";
// 2. If logged out: user only sends POST request to website when selecting movies and applying a rating to a "temporary" user to make a recommendation
// 3. If logged in: user send POST request to website when selecting movies and applying a rating, and saves this rating with the user's data

function Query() {
  const { isLoggedIn, user } = useAuth();
  
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
      <MovieSearchBar />
    </>
  )
}

export default Query;
