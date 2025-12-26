import Button from "./components/Button";

const loginFormHandler = () => {
  console.log("Send login form to backend.\n");
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
          Login
        </Button>
      </div>
    </>
  );
}

export default Login;
