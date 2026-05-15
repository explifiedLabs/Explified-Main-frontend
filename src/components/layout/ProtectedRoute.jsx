import { Navigate } from "react-router";
import { useAuth } from "../../hooks/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Prevent redirect flicker while auth is loading
  if (loading) {
    return <div className="min-h-screen bg-[#050816]" />;
  }

  // User not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
