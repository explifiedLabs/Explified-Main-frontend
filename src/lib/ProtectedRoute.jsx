import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="min-h-screen bg-[#0B0C10]" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}