import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { likeShop, unlikeShop } from "../../services/shops/likedShops";
import { Link, useNavigate } from "react-router-dom";
import { formatSpeciality } from "../../utils/formatSpeciality";
const LikedShop = ({ shop, userId }) => {
  const [liked, setLiked] = useState(true);
  const navigate = useNavigate();
  const toggleLike = async () => {
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
    <div className="flex justify-between items-center border sm:p-2 p-1 rounded">
      <div className="flex flex-1 gap-2" onClick={() => openShop()}>
        <img
          className="w-10 h-10 rounded-full border object-cover"
          src={shop.profile_picture}
          alt="Shop Profile"
        />
        <div>
          <h1 className="my-0">
            <span className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200">
              {shop.name} {shop.last_name}
            </span>{" "}
            ({shop.localisation})
          </h1>
          {shop.speciality?.length > 0 && (
            <span className="crimsonText inline-block my-0">
              {formatSpeciality(shop.speciality)}
            </span>
          )}
        </div>
      </div>
      <div className="flex w-fit gap-1">
        <div className="flex items-center">
          <h1>{shop.average_rating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop.average_rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({shop.total_rating})</h1>
        </div>
        <IconButton onClick={toggleLike} color={liked ? "error" : "default"}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </div>
    </div>
  );
};

export default LikedShop;
