import "./styling/App.css";
import LandingPage from "./pages/LandingPage.tsx";
import Login from "./pages/Login.tsx";
import Query from "./pages/Query.tsx";
import SignUp from "./pages/SignUp.tsx";
import Layout from "./Layout.tsx";
import Account from "./pages/Account.tsx";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* LandingPage without navbar */}
        <Route path="/" element={<LandingPage />} />

        {/* All other pages with navbar using Layout */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/query" element={<Query />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
