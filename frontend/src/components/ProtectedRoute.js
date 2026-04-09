import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, allowedRole, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/cliente"} replace />;
  }
  return children;
}
