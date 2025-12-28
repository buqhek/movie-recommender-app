import { useState, useEffect } from "react";
import Button from "../components/Button";

const loginFormHandler = () => {
  console.log("Send login form to backend.\n");
};

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="username"
          className="form-control"
          id="floatingInput"
          placeholder="unique_username"
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <div>
        <Button color="success" onClick={loginFormHandler}>
          Create Account
        </Button>
      </div>
    </>
  );
}

export default SignUp;
