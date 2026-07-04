import { useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import UserProfile from "@/user-profile/UserProfile";
import ShopProfile from "@/shop-profile/ShopProfile";
import { Navigate } from "react-router-dom";

const Account = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user?.role == "client") {
    return <UserProfile userId={user?.id} />;
  } else if (user?.role == "vendeur") {
    return <ShopProfile userId={user?.id} />;
  }
};

export default Account;
