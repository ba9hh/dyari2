import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import UserInfoSkeleton from "@/skeleton/user-profile/UserInfoSkeleton";
export default function ProtectedRoute({ children, requireRole }) {
  const { user, sessionChecked } = useContext(AuthContext);
  const location = useLocation();

  // Auth state hasn't finished loading yet — don't redirect prematurely
  if (!sessionChecked) {
    return <UserInfoSkeleton />;
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
