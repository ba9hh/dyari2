import ReactStars from "react-rating-stars-component";
import biscuit50 from "@/assets/biscuit50.jpg";
import { useNavigate } from "react-router-dom";
import { buildShopSlug } from "@/utils/shopSlug";

const HomeShop = ({ shop }) => {
  const navigate = useNavigate();
  const openShop = () => {
    navigate(`/boutique/${buildShopSlug(shop)}`);
  };

  return (
    <div
      className="bg-white rounded-none sm:rounded-md border border-gray-200 sm:border-gray-300 cursor-pointer sm:shadow-none overflow-hidden"
      onClick={openShop}
    >
      {/* Images grid — same 3-col layout for both */}
      <div className="relative">
        <div className="absolute right-0 -top-0 z-10 bg-amber-100 text-amber-800 px-1.5 py-0.5 text-xs sm:text-sm border border-amber-300 font-semibold">
          {shop.category}
        </div>

        {/* Shared grid for mobile & desktop */}
        <div className="hidden sm:grid grid-cols-3 gap-0 sm:gap-3 sm:px-3 sm:py-3 sm:bg-gray-100/50">
          {shop.articles?.slice(0, 3).map((article, index) => (
            <img
              key={index}
              className="w-full aspect-square object-cover sm:rounded-md sm:hover:scale-105 sm:transition-transform sm:duration-300"
              src={article?.article_image ?? biscuit50}
            />
          ))}
        </div>
        <div className="flex sm:hidden gap-0 overflow-x-auto scrollbar-hide">
          {shop.articles?.slice(0, 3).map((article, index) => (
            <img
              key={index}
              className="flex-shrink-0 w-2/5 aspect-square object-cover"
              src={article?.article_image ?? biscuit50}
            />
          ))}
        </div>

        {shop.numberOfArticles > 3 && (
          <div className="absolute right-0 bottom-0 bg-gray-100 text-gray-500 font-bold text-sm p-2 rounded-ss-md border-2">
            {`+${shop.numberOfArticles - 3}`}
          </div>
        )}
      </div>

      {/* Info row */}
      <div className="flex justify-between items-center px-3 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center flex-1 gap-2 min-w-0">
          <img
            className="w-9 h-9 rounded-full border border-gray-200 object-cover flex-shrink-0"
            src={shop.profile_picture}
            alt="Shop Profile"
          />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-medium text-gray-800">
              {shop.business_name}
            </h1>
            <span className="truncate text-xs text-gray-500 block">
              {shop.address}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold rounded-full py-1 px-2.5 border bg-amber-50 text-amber-600 border-amber-200">
          {shop.average_rating ?? 0}
          <ReactStars
            count={5}
            size={14}
            value={shop.average_rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#d97706"
          />
          <span className="text-gray-400 text-xs">({shop.total_rating})</span>
        </div>
      </div>
    </div>
  );
};

export default HomeShop;
