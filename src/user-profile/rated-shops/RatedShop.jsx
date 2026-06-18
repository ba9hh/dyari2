import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
import { formatSpeciality } from "@/utils/formatSpeciality";

const RatedShop = ({ shop }) => {
  const navigate = useNavigate();
  const openShop = () => {
    navigate("/shop", { state: shop?.id });
  };

  const userRating = shop.userReview?.rating ?? null;

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
            <h1 className="text-xs text-gray-400">{shop.address || ""}</h1>
          </div>
        </div>

        {/* Right: user rating badge */}
        <div className="flex flex-col items-end gap-1">
          {userRating != null && (
            <span className="flex items-center gap-1 text-xs font-semibold rounded-full py-1 px-3 border bg-amber-50 text-amber-600 border-amber-200">
              {userRating}
              <ReactStars
                count={5}
                size={16}
                value={userRating}
                isHalf={true}
                edit={false}
                activeColor="#d97706"
              />
            </span>
          )}
          {shop.userReview?.comment_text && (
            <p className="text-sm text-gray-600 italic truncate text-end">
              "{shop.userReview.comment_text}"
            </p>
          )}
        </div>
      </div>

      {/* Footer: speciality + comment */}
      {(shop.speciality?.length > 0 || shop.userReview?.comment_text) && (
        <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50 flex flex-col gap-1.5">
          {shop.speciality?.length > 0 && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Spécialité
              </span>
              <span className="crimsonText text-sm">
                {formatSpeciality(shop.speciality)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RatedShop;
