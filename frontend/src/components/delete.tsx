import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Delete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDelete = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status == 204) {
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
        handleDelete(e);
      }}
    >
      <div>
        <button
          type="submit"
          color="success"
          className="btn btn-success"
          disabled={loading}
        >
          Delete Account
        </button>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </form>
  );
}

export default Delete;
