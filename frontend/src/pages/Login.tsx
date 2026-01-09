import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { login } = useAuth();  // ← Get login function
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
    setLoading(true); 

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.status == 200) {
        const data = await response.json();
        login(data);  // update global auth state
        navigate("/query");
      } else if (response.status == 400) {
        setError("Username and password are required");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
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
          onChange={handlePasswordInput}
          required 
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
