import Button from "./components/Button";

const loginHandler = () => {
  console.log("Send user to login page.\n");
};

const createHandler = () => {
  console.log("Send user to sign up page.\n");
};

const guestHandler = () => {
  console.log("Send user to main page.\n");
};

function LandingPage() {
  return (
    <>
      <h1>Welcome to Hektor's Movie Recommender</h1>
      <p>
        Sign in to view and modify your list of seen movies for a better
        recommendation. Otherwise, go through guest for a quick search!
      </p>
      <Button color="success" onClick={loginHandler}>
        Login
      </Button>
      <Button color="success" onClick={createHandler}>
        Create Account
      </Button>
      <Button color="success" onClick={guestHandler}>
        Continue as Guest
      </Button>
    </>
  );
}

export default LandingPage;
