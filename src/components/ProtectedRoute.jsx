import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import UserInfoSkeleton from "@/skeleton/user-profile/UserInfoSkeleton";
export default function ProtectedRoute({ children, requireRole }) {
  const { user, sessionChecked } = useContext(AuthContext);
  const location = useLocation();

  // Auth state hasn't finished loading yet — don't redirect prematurely
  if (!sessionChecked) {
    return (
      <div className="flex flex-col min-h-screen items-center sm:pt-16 pb-8 bg-white sm:bg-gray-100/50 gap-y-4">
        <UserInfoSkeleton />
      </div>
    );
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
