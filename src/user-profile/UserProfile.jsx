import InformationUser from "./InformationUser";
import OrdersUser from "./orders/OrdersUser";
import DyariLogo from "../components/DyariLogo";
import AboutUser from "./settings/AboutUser";
import LikedShops from "./liked-shops/LikedShops";
import RatedShops from "./rated-shops/RatedShops";
import { useState } from "react";
const UserProfile = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <div className="flex flex-col min-h-screen items-center pt-16 pb-8 bg-white sm:bg-[#F5F5F5] gap-y-4">
      <DyariLogo />
      <InformationUser
        userId={userId}
        handleChange={handleChange}
        activeTab={activeTab}
      />
      {activeTab === "orders" && <OrdersUser userId={userId} />}
      {activeTab === "ratedShops" && <RatedShops userId={userId} />}
      {activeTab === "likedShops" && <LikedShops userId={userId} />}
    </div>
  );
};

export default UserProfile;
