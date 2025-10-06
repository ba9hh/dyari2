import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import AboutUser from "../user-profile/settings/AboutUser";
import AboutShop from "../shop-profile/settings/AboutShop";
const Settings = () => {
  const { user } = useContext(AuthContext);
  if (user?.role == "user") {
    return <AboutUser userId={user?.id} />;
  } else if (user?.role == "shop") {
    return <AboutShop shopId={user?.id} />;
  }
};

export default Settings;
