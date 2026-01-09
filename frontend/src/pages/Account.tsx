import Logout from "../components/logout";
import Delete from "../components/delete";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Account() {
  const { user } = useAuth();
  // Add more data as needed

  return (
    <>
      <h1>Welcome, {user?.username}</h1>
      <p>{user?.email}</p>
      <Logout />
      <Delete />
    </>
  );
}

export default Account;
