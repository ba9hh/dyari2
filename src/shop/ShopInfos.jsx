import { useState, useEffect, useContext } from "react";
import SkeletonInformationShop from "@/skeleton/shop/SkeletonInformationShop";
import { Link, useNavigate } from "react-router-dom";
import RatingTest from "@/components/RatingTest";
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
import { formatSpeciality } from "@/utils/formatSpeciality";
import ReactStars from "react-rating-stars-component";

const ShopInfos = ({ shopId, handleChange, activeTab }) => {
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
    queryFn: () => fetchShopInfo(shopId),
  });
  console.log(shopId);
  console.log(shop);
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
    if (!user || user?.role == "vendeur") {
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
    <div className="relative w-full sm:w-2/3 bg-white shadow-sm rounded-md border">
      <div className="flex justify-between items-center border-b p-2">
        {/* <div className="">
          <RatingTest shopId={shopId} />
        </div> */}
        <div className="flex items-center ">
          <h1>{shop?.average_rating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop?.average_rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({shop?.total_rating})</h1>
        </div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            backgroundColor: "#d97706",
            "&:hover": {
              backgroundColor: "#b45309",
            },
          }}
          onClick={() => openOrder()}
        >
          Passer votre commande
        </Button>
        {/* <button
          className="text-sm text-white bg-amber-600 font-semibold px-3 py-1"
          onClick={() => openOrder()}
        >
          Passer votre commande
        </button> */}
      </div>

      <div className="flex justify-center my-4">
        <div className="flex flex-col items-center gap-0">
          <img
            className="w-16 h-16 border-2 p-1 rounded-full bg-white object-cover"
            src={shop?.profile_picture}
          />
          <h1 className="text-lg">
            {shop?.business_name} ({shop?.address})
          </h1>
          {shop?.speciality?.length > 0 && (
            <span className="crimsonText inline-block my-0">
              {formatSpeciality(shop?.speciality)}
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
          sx={{
            mb: 0,
            px: 2,
            "& .MuiTabs-indicator": {
              backgroundColor: "#d97706",
              height: "4px",
            },
          }}
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
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "#d97706",
              },
            }}
          />
          {/* <Tab
            label="Contact"
            value="contact"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          /> */}
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
