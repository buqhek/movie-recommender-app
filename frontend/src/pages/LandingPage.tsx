import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

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
