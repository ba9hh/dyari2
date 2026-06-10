import ShopInfos from "./ShopInfos";
import ShopArticles from "./ShopArticles";
import ShopContact from "./ShopContact";
import { useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import LoginRequiredDialog from "@/components/dialog/LoginRequiredDialog";
import { Button } from "@mui/material";

const Shop = () => {
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState("articles");
  const [isConnected, setIsConnected] = useState(false);

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
  return (
    <div className="flex flex-col min-h-screen items-center pt-16 pb-8 bg-white sm:bg-gray-100/50 gap-y-4 w-full">
      <ShopInfos
        shopId={state}
        handleChange={handleChange}
        activeTab={activeTab}
      />
      <div className="relative w-full sm:w-2/3">
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          sx={{
            textTransform: "none",
            backgroundColor: "#d97706",
            "&:hover": {
              backgroundColor: "#b45309",
            },
          }}
          // onClick={() => openOrder()}
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
