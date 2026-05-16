import React from "react";
import { Navigate } from "react-router"; // or "react-router"
import { useSelector } from "react-redux"; // <-- USING REDUX NOW

const ProtectedRoute = ({ children }) => {
  // Grab user state from Redux instead of AuthContext
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-white">
        Loading...
      </div>
    ); 
  }

  // If there is no user logged in, send them back to the home page "/"
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If they are logged in, let them see the page
  return children;
};

export default ProtectedRoute;