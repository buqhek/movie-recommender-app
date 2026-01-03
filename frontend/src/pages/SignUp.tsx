import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle username input
  const handleUsernameInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  // Handle email input
  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // Handle password input
  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Handle confirm password input
  const handleConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  // Handle API calls, logic, etc...
  const signupFormHandler = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, username, password, confirmPassword }),
        }
      );

      if (response.status == 201) {
        navigate("/query");
      } else if (response.status == 400) {
        setError("Username, email, and password are required");
      } else if (response.status == 409) {
        setError("Username or email already in use");
      } else {
        setError(
          "Database error has occurred. Try again in a couple of minutes"
        );
      }
    } catch (err) {
      console.log("error: ", { err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        signupFormHandler(e);
      }}
    >
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          onChange={handleEmailInput}
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="username"
          className="form-control"
          id="floatingInput"
          placeholder="unique_username"
          onChange={handleUsernameInput}
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={handlePasswordInput}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="floatingConfirmPassword"
          placeholder="Confirm Password"
          onChange={handleConfirmPassword}
        />
        <label htmlFor="floatingPassword">Confirm Password</label>
      </div>

      <div>
        <button type="submit" color="btn btn-success" disabled={loading}>
          Create Account
        </button>
        {error && <p className="button-error-text">{error}</p>}
      </div>
    </form>
  );
}

export default SignUp;
