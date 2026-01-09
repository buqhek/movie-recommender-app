import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  return (
    <>
      <Button color="primary" onClick={() => navigate("/query")}>
        Home
      </Button>
      { isLoggedIn ? (
        <Button color="primary" onClick={() => navigate("/account")}>
          {user?.username}
        </Button>
      ) : (
        <Button color="primary" onClick={() => navigate("/login")}>
          Login
        </Button>
      )
      }
    </>
  );
};

export default Navbar;
