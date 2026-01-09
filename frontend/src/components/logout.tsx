import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Logout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const { logout } = useAuth();  // ← Get logout function;
  const navigate = useNavigate();

  const handleLogout = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status == 200) {
        logout();  // update global auth state
        navigate("/");
      } else {
        setError("Error: Authentiation required");
      }
    } catch (err) {
      console.log("Error:", { err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        handleLogout(e);
      }}
    >
      <div>
        <button
          type="submit"
          color="success"
          className="btn btn-success"
          disabled={loading}
        >
          Logout
        </button>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </form>
  );
}

export default Logout;
