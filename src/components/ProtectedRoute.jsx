import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, sessionChecked } = useContext(AuthContext);
  const location = useLocation();

  // Auth state hasn't finished loading yet — don't redirect prematurely
  if (!sessionChecked) {
    return <div className="p-8 text-center">Loading...</div>; // swap for your own spinner
  }

  // Not logged in — send to login, remembering where they wanted to go
  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  // Optional: role-based protection (e.g. requireRole="vendor")
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
