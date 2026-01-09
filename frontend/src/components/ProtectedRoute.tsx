import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading){
        return (
            <div>
                <h1>
                    Loading...
                </h1>
            </div>
        );
    }

    if (!isLoggedIn){
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute