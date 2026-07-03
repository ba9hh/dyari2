import ShopInfos from "./ShopInfos";
import ShopArticles from "./ShopArticles";
import { useState, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import LoginRequiredDialog from "@/components/dialog/LoginRequiredDialog";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShopCommentaires from "./shopComments";
import { useParams, useNavigate } from "react-router-dom";
import { extractShopId } from "@/utils/shopSlug";

const Shop = () => {
  const { user } = useContext(AuthContext);
  const { shopSlug } = useParams();
  const shopId = extractShopId(shopSlug);
  const [activeTab, setActiveTab] = useState("articles");
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setIsConnected(false);
  const handleChange = (event, newValue) => setActiveTab(newValue);
  const openOrder = () => navigate("order", { state: shopId });

  return (
    <div className="flex flex-col min-h-screen items-center pt-0 sm:pt-16 pb-8 bg-white sm:bg-gray-100/50 gap-y-3 sm:gap-y-4 w-full px-0 sm:px-4">
      <ShopInfos
        shopId={shopId}
        handleChange={handleChange}
        activeTab={activeTab}
      />

      {/* Order button */}
      <div className="relative w-full sm:w-2/3 px-3 sm:px-0">
        <Button
          variant="outlined"
          fullWidth
          sx={{
            textTransform: "none",
            color: "#d97706",
            borderColor: "#d97706",
            "&:hover": {
              borderColor: "#b45309",
              backgroundColor: "rgba(217, 119, 6, 0.04)",
            },
          }}
          onClick={openOrder}
        >
          Passer votre commande
        </Button>
      </div>

      {activeTab === "articles" && <ShopArticles shopId={shopId} />}
      {activeTab === "contact" && <ShopCommentaires shopId={shopId} />}

      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="Connectez-vous pour voir les informations supplémentaires"
      />
    </div>
  );
};

export default Shop;
