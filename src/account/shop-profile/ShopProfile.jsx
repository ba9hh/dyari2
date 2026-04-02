import { useState, useEffect } from "react";
import ShopInfo from "./info/ShopInfo";
import ArticlesShop from "./articles/ArticlesShop";
import OrdersShop from "./orders/OrdersShop";
import ContactShop from "./info/ContactShop";
import Button from "@mui/material/Button";
import { supabase } from "@/supabaseClient";
const ShopProfile = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("articles");
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const [shopId, setShopId] = useState(null);
  useEffect(() => {
    const fetchShop = async () => {
      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", userId)
        .single();
      if (shopError) {
        console.error(shopError);
        return;
      }
      setShopId(shop?.id);
    };
    if (userId) fetchShop();
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen items-center pt-16 pb-8 sm:bg-[#FFFFFF] bg-white gap-y-4">
      <ShopInfo
        shopId={userId}
        handleChange={handleChange}
        activeTab={activeTab}
      />
      {activeTab === "articles" && <ArticlesShop shopId={shopId} />}
      {activeTab === "orders" && <OrdersShop shopId={shopId} />}
      {activeTab === "contact" && <ContactShop shopId={shopId} />}
    </div>
  );
};

export default ShopProfile;
