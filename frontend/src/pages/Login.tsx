import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Button from "../components/Button";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const loginFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload
    setError("");
    setLoading(true);

    // API request

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // TODO: Redirect or update app state
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Unable to connect to server");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-floating mb-3">
        <input
          type="username"
          className="form-control"
          id="floatingInput"
          placeholder="unique_username"
          onChange={(e) => setUsername(e.target.value)} // e is a "ChangeEvent" type handler
          // (for when the input value changes)
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <div>
        <Button color="success" onClick={loginFormHandler}>
          Login
        </Button>
      </div>
    </>
  );
}

export default Login;
