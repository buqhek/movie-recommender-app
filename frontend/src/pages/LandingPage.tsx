import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

// const loginHandler = () => {
//   console.log("Send user to login page.\n");
// };

// const createHandler = () => {
//   console.log("Send user to sign up page.\n");
// };

// const guestHandler = () => {
//   console.log("Send user to main page.\n");
// };

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to Hektor's Movie Recommender</h1>
      <p>
        Sign in to view and modify your list of seen movies for a better
        recommendation. Otherwise, go through guest for a quick search!
      </p>
      <Button color="success" onClick={() => navigate("/login")}>
        Login
      </Button>
      <Button color="success" onClick={() => navigate("/signup")}>
        Create Account
      </Button>
      <Button color="success" onClick={() => navigate("/query")}>
        Continue as Guest
      </Button>
    </>
  );
}

export default LandingPage;
