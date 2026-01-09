import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ChangeEvent, FormEvent } from "react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co)$/i;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateUsername = (username: string): string => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 256) return "Password cannot be over 256 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPwd: string): string => {
    if (!confirmPwd) return "Please confirm your password";
    if (confirmPwd !== password) return "Passwords do not match";
    return "";
  };

  // Input handling
  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handleUsernameInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);
    if (touched.username) {
      setUsernameError(validateUsername(value));
    }
  };

  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
    // Re-validate confirm password if it's been filled
    if (touched.confirmPassword && confirmPassword) {
      setConfirmPasswordError(
        confirmPassword !== value ? "Passwords do not match" : ""
      );
    }
  };

  const handleConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(value));
    }
  };

  // Blurring
  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });

    // Trigger validation for the specific field
    switch (field) {
      case "email":
        setEmailError(validateEmail(email));
        break;
      case "username":
        setUsernameError(validateUsername(username));
        break;
      case "password":
        setPasswordError(validatePassword(password));
        break;
      case "confirmPassword":
        setConfirmPasswordError(validateConfirmPassword(confirmPassword));
        break;
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      !emailError &&
      !usernameError &&
      !passwordError &&
      !confirmPasswordError &&
      email &&
      username &&
      password &&
      confirmPassword
    );
  };

  // Handle API calls
  const signupFormHandler = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const emailErr = validateEmail(email);
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword);

    setEmailError(emailErr);
    setUsernameError(usernameErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    // If any validation errors, don't submit
    if (emailErr || usernameErr || passwordErr || confirmPasswordErr) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, username, password }),
        }
      );

      if (response.status === 201) {
        login({ username, email});  // update global auth state
        navigate("/query");
      } else if (response.status === 400) {
        setError("Username, email, and password are required");
      } else if (response.status === 409) {
        setError("Username or email already in use");
      } else {
        setError(
          "Database error has occurred. Try again in a couple of minutes"
        );
      }
    } catch (err) {
      console.log("error: ", { err });
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={signupFormHandler}>
      <div className="form-floating mb-3">
        <input
          type="email"
          className={`form-control ${
            touched.email ? (emailError ? "is-invalid" : "is-valid") : ""
          }`}
          id="floatingEmail"
          placeholder="name@example.com"
          value={email}
          onChange={handleEmailInput}
          onBlur={() => handleBlur("email")}
        />
        <label htmlFor="floatingEmail">Email address</label>
        {touched.email && emailError && (
          <div className="invalid-feedback">{emailError}</div>
        )}
      </div>

      <div className="form-floating mb-3">
        <input
          type="text"
          className={`form-control ${
            touched.username ? (usernameError ? "is-invalid" : "is-valid") : ""
          }`}
          id="floatingUsername"
          placeholder="unique_username"
          value={username}
          onChange={handleUsernameInput}
          onBlur={() => handleBlur("username")}
        />
        <label htmlFor="floatingUsername">Username</label>
        {touched.username && usernameError && (
          <div className="invalid-feedback">{usernameError}</div>
        )}
      </div>

      <div className="form-floating mb-3">
        <input
          type="password"
          className={`form-control ${
            touched.password ? (passwordError ? "is-invalid" : "is-valid") : ""
          }`}
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={handlePasswordInput}
          onBlur={() => handleBlur("password")}
        />
        <label htmlFor="floatingPassword">Password</label>
        {touched.password && passwordError && (
          <div className="invalid-feedback">{passwordError}</div>
        )}
      </div>

      <div className="form-floating mb-3">
        <input
          type="password"
          className={`form-control ${
            touched.confirmPassword
              ? confirmPasswordError
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          id="floatingConfirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPassword}
          onBlur={() => handleBlur("confirmPassword")}
        />
        <label htmlFor="floatingConfirmPassword">Confirm Password</label>
        {touched.confirmPassword && confirmPasswordError && (
          <div className="invalid-feedback">{confirmPasswordError}</div>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading || !isFormValid()}
        >
          Create Account
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </form>
  );
}

export default SignUp;
