import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { likeShop, unlikeShop } from "@/services/shops/likedShops";
import { useNavigate } from "react-router-dom";
import { formatSpeciality } from "@/utils/formatSpeciality";

const LikedShop = ({ shop, userId }) => {
  const [liked, setLiked] = useState(true);
  const navigate = useNavigate();

  const toggleLike = async (e) => {
    e.stopPropagation();
    try {
      if (liked) {
        await unlikeShop(userId, shop.id);
        setLiked(false);
      } else {
        await likeShop(userId, shop.id);
        setLiked(true);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const openShop = () => {
    navigate("/shop", { state: shop?.id });
  };

  return (
    <div className="w-full rounded-md border border-gray-200 bg-white overflow-hidden transition-all duration-200">
      {/* Header row */}
      <div
        className="flex justify-between items-center px-3 py-2.5 cursor-pointer select-none hover:bg-gray-50 transition-colors duration-150"
        onClick={openShop}
      >
        {/* Left: shop info */}
        <div className="flex items-center gap-2">
          <img
            className="w-10 h-10 rounded-full border object-cover"
            src={shop.profile_picture}
            alt="Shop Profile"
          />
          <div>
            <h1 className="text-sm font-medium text-amber-600 hover:text-amber-700 underline transition-colors duration-200">
              {shop.business_name}
            </h1>
            <h1 className="text-xs text-gray-400">{shop.address}</h1>
          </div>
        </div>

        {/* Right: rating badge + like button */}
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-xs font-semibold rounded-full py-1 px-3 border bg-amber-50 text-amber-600 border-amber-200">
            {shop.average_rating ?? 0}
            <ReactStars
              count={5}
              size={16}
              value={shop.average_rating || 0}
              isHalf={true}
              edit={false}
              activeColor="#d97706"
            />
            <span className="text-gray-400">({shop.total_rating})</span>
          </span>
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
      </div>

      {/* Footer: speciality */}
      {shop.speciality?.length > 0 && (
        <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Spécialité
            </span>
            <span className="crimsonText text-sm">
              {formatSpeciality(shop.speciality)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedShop;
