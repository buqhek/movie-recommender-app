import { useState, useEffect } from "react";
import Button from "../components/Button";

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [result, setResult] = useState({});

interface User {
  name: string;
  email: string;
}

const handleUsernameInput = (event) => {
  setUsername(event.target.value);
};

const handlePasswordInput = (event) => {
  setPassword(event.target.value);
};

async function fetchLoginInfo(): Promise<User> {
  const response = await fetch("/api/v1/login");
  const data = await response.json();
  return data;
}

useEffect(() => {
  fetchLoginInfo().then((data) => setResult(data));
}, []);

const loginFormHandler = async () => {
  // console.log("Send login form to backend.\n");
  const request: RequestInfo = new Request("./api/v1/login", {
    method = "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(User),
  });

  fetch(request)
    .then((res) => res.json())
    .then((res) => {
      setResult(res); // Save the fetch result to the "result" object (a hashmap)
      console.log(res); // Print the result
    });
  // Fetching the api data using async await
  // try{
  //   const response = await fetch('/api/v1/login'){
  //     Crede
  //   }
  // }
};

function Login() {
  return (
    <>
      <div className="form-floating mb-3">
        <input
          type="username"
          className="form-control"
          id="floatingInput"
          placeholder="unique_username"
          onChange={handleUsernameInput} // Necessary to update the
          // useStates during input
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={handlePasswordInput} // Necessary to update the
          // useStates during input
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
