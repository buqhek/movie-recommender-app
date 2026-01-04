import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Account() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  // TODO: Allow for username change,
  //       account deletion, and movie
  //       rating updating

  //   TODO: Movie rating updates (Possible Component?)
  //       Search bar for the movie in the database.
  //       If it exists, you make sure to have the
  //       movie appear as a rating from 0-5 with 0.5
  //       increments. This can be in star format, or
  //       something for user implementation.
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

export default Account;
