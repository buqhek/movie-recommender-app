import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Updates the state of username after every keystroke for the input
  const handleUsernameInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  // Updates the state of password after every keystroke for the input
  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Handle API call, errors, etc...
  const loginFormHandler = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault(); // Prevent page reload
    setLoading(true); // User can't click button again

    try {
      // Make fetch request for the login api endpoint
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      // Navigate to the write page if correct, display error otherwise
      if (response.status == 200) {
        // Send to query (main page)
        navigate("/query");
      } else if (response.status == 400) {
        setError("Username and password are required");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      // if error, explain server issues, ask user to try again
      console.log(
        "We are having server issues right now. Try again in a couple minutes."
      );
    } finally {
      setLoading(false); // Request went all the way through, allow to try again
    }
  };

  return (
    <form
      onSubmit={(e) => {
        loginFormHandler(e);
      }}
    >
      <div className="form-floating mb-3">
        <input
          type="username"
          className="form-control"
          id="floatingInput"
          placeholder="unique_username"
          // Necessary to update the useStates during input
          onChange={handleUsernameInput}
          required // Won't submit if empty
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          // Necessary to update the useStates during input
          onChange={handlePasswordInput}
          required // Won't submit if empty
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <div>
        <button
          type="submit"
          color="success"
          className="btn btn-success"
          // Check if username or password are empty
          disabled={loading || !username.trim() || !password.trim()}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </form>
  );
}

export default Login;
