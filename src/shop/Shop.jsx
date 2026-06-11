import ShopInfos from "./ShopInfos";
import ShopArticles from "./ShopArticles";
import { useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import LoginRequiredDialog from "@/components/dialog/LoginRequiredDialog";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState("articles");
  const [isConnected, setIsConnected] = useState(false);

  const navigate = useNavigate();
  const handleClose = () => {
    setIsConnected(false);
  };
  const handleChange = (event, newValue) => {
    if (newValue === "contact") {
      if (!user) {
        setIsConnected(true);
        return;
      }
      setActiveTab("contact");
    } else {
      setActiveTab(newValue);
    }
  };
  const openOrder = () => {
    navigate("order", { state: state });
  };
  return (
    <div className="flex flex-col min-h-screen items-center pt-16 pb-8 bg-white sm:bg-gray-100/50 gap-y-4 w-full">
      <ShopInfos
        shopId={state}
        handleChange={handleChange}
        activeTab={activeTab}
      />
      <div className="relative w-full sm:w-2/3">
        <Button
          variant="outlined"
          color="primary"
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
          onClick={() => openOrder()}
        >
          Passer votre commande
        </Button>
      </div>
      {activeTab === "articles" && <ShopArticles shopId={state} />}
      {/* {activeTab === "contact" && <ShopContact shopId={state} />} */}
      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in to see the shop additional information"
      />
    </div>
  );
};

export default Shop;
