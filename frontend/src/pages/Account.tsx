import Logout from "../components/logout";
import Delete from "../components/delete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Account() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  // Add more data as needed

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.status == 200) {
          const data = await response.json();
          setUsername(data["username"]);
          setEmail(data["email"]);
        } else if (response.status == 401) {
          setError("User is not authenticated");
          // navigate("/");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.log("Error:", { err });
      }
    };

    fetchAccountData();
  }, []); // Run once
  return (
    <>
      <h1>Debug: {username}</h1>
      <h1>Debug: {email}</h1>
      {error && <p className="text-danger">{error}</p>}
      <Logout />
      <Delete />
    </>
  );
}

export default Account;
