import { useState, useEffect, useContext } from "react";
import SkeletonShopInfo from "@/skeleton/shop/SkeletonShopInfo";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "@/AuthProvider";
import Button from "@mui/material/Button";
import { Tabs, Tab, Box } from "@mui/material";
import LoginRequiredDialog from "@/components/dialog/LoginRequiredDialog";
import { fetchShopInfo } from "@/services/shops/ShopInformation";
import { likeShop, unlikeShop, isShopLiked } from "@/services/shops/likedShops";
import { useQuery } from "@tanstack/react-query";
import ReactStars from "react-rating-stars-component";

const ShopInfos = ({ shopId, handleChange, activeTab }) => {
  const [liked, setLiked] = useState(false);
  const { user } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setIsConnected(false);

  const { data: shop, isLoading } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => fetchShopInfo(shopId),
  });

  useEffect(() => {
    const checkLiked = async () => {
      if (user) {
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
    if (!user) {
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

  const openOrder = () => navigate("order", { state: shopId });

  if (isLoading) return <SkeletonShopInfo />;

  return (
    <div className="relative w-full sm:w-2/3 bg-white shadow-sm sm:rounded-md border border-gray-200">
      {/* Top bar: rating + review button */}
      <div className="flex justify-between items-center border-b border-gray-200 px-3 py-2">
        <div className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold rounded-full py-1 px-2.5 border bg-amber-50 text-amber-600 border-amber-200">
          <span>{shop?.average_rating}</span>
          <ReactStars
            count={5}
            size={16}
            value={shop?.average_rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#d97706"
          />
          <span className="text-gray-400 text-xs">({shop?.total_rating})</span>
        </div>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            // fontSize: "0.75rem",
            backgroundColor: "#d97706",
            "&:hover": { backgroundColor: "#b45309" },
          }}
          onClick={openOrder}
        >
          Laisser un avis
        </Button>
      </div>

      {/* Profile section */}
      <div className="flex flex-col items-center py-4 px-4 gap-1">
        <img
          className="w-16 h-16 border-2 p-0.5 rounded-full bg-white object-cover"
          src={shop?.profile_picture}
          alt={shop?.business_name}
        />
        <h1 className="text-lg sm:text-xl font-medium mt-1 text-gray-800">
          {shop?.business_name}
        </h1>
        <p className="text-sm text-gray-500 italic text-center border-b border-gray-100 pb-2 px-6 max-w-xs">
          {shop?.bio}
        </p>
        {/* Info pills — stack on mobile, row on desktop */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-gray-600 text-center">
          <span>
            <span className="font-medium text-gray-700">Spécialité:</span>{" "}
            {shop?.category}
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>
            <span className="font-medium text-gray-700">Localisation:</span>{" "}
            {shop?.address}
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>
            <span className="font-medium text-gray-700">Tél:</span>{" "}
            {shop?.phone_number}
          </span>
        </div>
      </div>

      {/* Like button */}
      <div className="absolute bottom-3 right-1 z-10">
        <IconButton
          onClick={toggleLike}
          color={liked ? "error" : "default"}
          size="small"
        >
          {liked ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>
      </div>

      {/* Tabs */}
      <Box sx={{ borderTop: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          centered
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#d97706",
              height: "3px",
            },
          }}
        >
          <Tab
            label="Articles"
            value="articles"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              color: "text.secondary",
              "&.Mui-selected": { color: "#d97706" },
            }}
          />
          <Tab
            label="Avis"
            value="contact"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              color: "text.secondary",
              "&.Mui-selected": { color: "#d97706" },
            }}
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

export default ShopInfos;
