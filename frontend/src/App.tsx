import "./styling/App.css";
import LandingPage from "./pages/LandingPage.tsx";
import Login from "./pages/Login.tsx";
import Query from "./pages/Query.tsx";
import SignUp from "./pages/SignUp.tsx";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Query />} />
      </Routes>
    </Router>
  );
}

export default App;
