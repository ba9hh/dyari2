import { useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import UserSettings from "./user-profile/user-settings/UserSettings";
import ShopSettings from "./shop-profile/shop-settings/ShopSettings";
const AccountSettings = () => {
  const { user } = useContext(AuthContext);
  if (user?.role == "user") {
    return <UserSettings userId={user?.id} />;
  } else if (user?.role == "shop") {
    return <ShopSettings shopId={user?.id} />;
  }
};

export default AccountSettings;
