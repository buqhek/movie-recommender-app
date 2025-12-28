import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button color="primary" onClick={() => navigate("/query")}>
        Home
      </Button>
      <Button color="primary" onClick={() => navigate("/account")}>
        Account
      </Button>
    </>
  );
};

export default Navbar;
