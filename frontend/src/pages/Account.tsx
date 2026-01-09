import Logout from "../components/logout";
import Delete from "../components/delete";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Account() {
  const { user } = useAuth();
  // Add more data as needed

  if (!user) {
    return <div><h1>Loading...</h1></div>;
  }

  return (
    <>
      <h1>Account Settings</h1>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
      <Logout />
      <Delete />
    </>
  );
}

export default Account;
