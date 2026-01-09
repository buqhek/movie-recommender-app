import "./styling/App.css";
import LandingPage from "./pages/LandingPage.tsx";
import Login from "./pages/Login.tsx";
import Query from "./pages/Query.tsx";
import SignUp from "./pages/SignUp.tsx";
import Layout from "./Layout.tsx";
import Account from "./pages/Account.tsx";
import { AuthProvider} from "./context/AuthContext.tsx"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    // Wrap entire app to use AuthContext
    <AuthProvider> 
      <Router>
        <Routes>
          {/* LandingPage without navbar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* All other pages with navbar using Layout */}
          <Route element={<Layout />}>
            <Route path="/query" element={<Query />} />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
                </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
