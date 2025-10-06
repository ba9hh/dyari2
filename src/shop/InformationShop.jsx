import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SkeletonInformationShop from "../skeleton/shop/SkeletonInformationShop";
import { Link, useNavigate } from "react-router-dom";
import RatingTest from "../components/RatingTest";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../AuthProvider";
import Button from "@mui/material/Button";
import { Tabs, Tab, Box } from "@mui/material";
import LoginRequiredDialog from "../components/LoginRequiredDialog";
import { fetchShopInformation } from "../services/shops/ShopInformation";
import {
  likeShop,
  unlikeShop,
  isShopLiked,
} from "../services/shops/likedShops";
import { useQuery } from "@tanstack/react-query";
import { formatSpeciality } from "../utils/formatSpeciality";

const InformationShop = ({ shopId, handleChange, activeTab }) => {
  const [liked, setLiked] = useState(false);
  const { user } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => {
    setIsConnected(false);
  };
  const {
    data: shop,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["shop", shopId], // unique query key
    queryFn: () => fetchShopInformation(shopId),
  });
  useEffect(() => {
    const checkLiked = async () => {
      if (user && user.role === "user") {
        try {
          const likedStatus = await isShopLiked(user.id, shopId);
          setLiked(likedStatus);
        } catch (err) {
          console.error("Error checking liked shop:", err);
        }
      }
    };
    checkLiked();
  }, [user, shopId]);
  const toggleLike = async () => {
    if (!user || user?.role == "shop") {
      setIsConnected(true);
      return;
    }
    try {
      if (liked) {
        await unlikeShop(user.id, shopId);
        setLiked(false);
      } else {
        await likeShop(user.id, shopId);
        setLiked(true);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };
  const openOrder = () => {
    navigate("order", { state: shopId });
  };
  if (isLoading) return <SkeletonInformationShop />;
  return (
    <div className="relative w-full sm:w-2/3 bg-white shadow-md rounded-md">
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{
          textTransform: "none",
          position: "absolute",
          top: "2px",
          right: "4px",
        }}
        onClick={() => openOrder()}
      >
        Passer votre commande
      </Button>
      <div className="absolute top-0 left-0">
        <RatingTest shopId={shopId} />
      </div>
      <div className="h-28 sm:h-40 bg-gradient-to-t from-gray-300 to-transparent flex justify-center items-center"></div>
      <div className="flex justify-center -mt-6">
        <div className="flex flex-col items-center gap-1 mb-4">
          <img
            className="w-16 h-16 border-2 p-1 rounded-full bg-white object-cover"
            src={shop?.profile_picture}
          />
          <h1 className="text-lg">
            {shop.name} {shop.last_name} ({shop.localisation})
          </h1>
          {shop.speciality?.length > 0 && (
            <span className="crimsonText inline-block my-0">
              {formatSpeciality(shop.speciality)}
            </span>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 z-10">
        <IconButton onClick={toggleLike} color={liked ? "error" : "default"}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </div>
      <Box sx={{ borderTop: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="standard"
          sx={{ mb: 0, px: 2 }}
          TabIndicatorProps={{
            style: {
              height: "4px",
            },
          }}
          centered
        >
          <Tab
            label="Articles"
            value="articles"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Contact"
            value="contact"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
        </Tabs>
      </Box>
      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in as a user to like a shop"
      />
    </div>
  );
};

export default InformationShop;
