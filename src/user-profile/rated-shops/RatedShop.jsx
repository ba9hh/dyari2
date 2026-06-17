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
    <div className="flex justify-between items-center border sm:p-2 p-1 rounded">
      <div className="flex flex-1 gap-2 cursor-pointer" onClick={openShop}>
        <img
          className="w-10 h-10 rounded-full border object-cover"
          src={shop.profile_picture}
          alt="Shop Profile"
        />
        <div>
          <h1 className="my-0">
            <span className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200">
              {shop.business_name}
            </span>
            {shop.address && (
              <span className="text-gray-500 text-sm ml-1">
                ({shop.address})
              </span>
            )}
          </h1>
          {shop.speciality?.length > 0 && (
            <span className="crimsonText inline-block my-0">
              {formatSpeciality(shop.speciality)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end w-fit">
        {/* Global shop rating */}
        {/* <div className="flex items-center">
          <h1 className="text-sm mr-1">Note globale : </h1>
          <h1>{Number(shop.average_rating).toFixed(1)}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop.average_rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1 className="text-sm text-gray-400">({shop.total_rating})</h1>
        </div> */}

        {/* User's own rating */}
        {userRating != null && (
          <div className="flex items-center">
            <h1 className="text-sm mr-1">Votre note : </h1>
            <h1>{userRating}</h1>
            <ReactStars
              count={5}
              size={20}
              value={userRating}
              isHalf={true}
              edit={false}
              activeColor="#FBBC04"
            />
          </div>
        )}

        {/* User's comment preview if any */}
        {shop.userReview?.comment_text && (
          <p className="text-sm text-gray-400 max-w-[180px] text-right truncate mt-0.5">
            "{shop.userReview.comment_text}"
          </p>
        )}
      </div>
    </div>
  );
};

export default RatedShop;
