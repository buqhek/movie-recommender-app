import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styling/index.css";
import "bootstrap/dist/css/bootstrap.css";
import LandingPage from "./LandingPage.tsx";
import Login from "./Login.tsx";
import SignUp from "./SignUp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <LandingPage /> */}
    {/* <Login /> */}
    <SignUp />
  </StrictMode>
);
