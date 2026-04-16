import ReactStars from "react-rating-stars-component";
import biscuit50 from "@/assets/biscuit50.jpg";
import { useNavigate } from "react-router-dom";
import { formatSpeciality } from "@/utils/formatSpeciality";
const HomeShop = ({ shop }) => {
  const navigate = useNavigate();
  const openShop = () => {
    navigate("/shop", { state: shop?.id });
  };
  return (
    <div
      className="bg-white sm:shadow-none py-3 sm:pt-3 sm:pb-3 sm:rounded-md sm:border-b border-b-[4px] border-gray-300 cursor-pointer sm:border"
      onClick={() => openShop()}
    >
      <div className="flex justify-between items-center sm:px-5 px-3 pb-3 sm:pb-3">
        <div className="relative flex items-center flex-1 gap-2">
          <img
            className="w-10 h-10 rounded-full border object-cover"
            src={shop.profile_picture}
            alt="Shop Profile"
          />
          <div>
            <h1 className="truncate">
              {shop.business_name} {shop.last_name} ({shop.address})
            </h1>
            {shop.speciality?.length > 0 && (
              <span className="crimsonText truncate">
                {formatSpeciality(shop.speciality)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <h1 className="text-sm sm:text-base">{shop.average_rating}</h1>
          <div className="block sm:hidden">
            <ReactStars
              count={5}
              size={15}
              value={shop.average_rating || 0}
              isHalf={true}
              edit={false}
              activeColor="#FBBC04"
            />
          </div>
          <div className="hidden sm:block">
            <ReactStars
              count={5}
              size={20}
              value={shop.average_rating || 0}
              isHalf={true}
              edit={false}
              activeColor="#FBBC04"
            />
          </div>
          <h1 className="text-sm sm:text-base">({shop.total_rating})</h1>
        </div>
      </div>
      <div className="relative sm:px-0.5 ">
        <div className="flex sm:hidden gap-0 overflow-x-auto scrollbar-hide mt-1">
          {shop.articles?.slice(0, 3).map((article, index) => (
            <img
              key={index}
              className="flex-shrink-0 w-40 aspect-[12/16] border object-cover"
              src={article?.article_image ?? biscuit50}
            />
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-0 sm:mt-0 border-t border-gray-300 pt-3 px-3">
          {shop.articles?.slice(0, 3).map((article, index) => (
            <img
              key={index}
              className="w-full aspect-square border object-cover"
              src={article?.article_image ?? biscuit50}
            />
          ))}
        </div>
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:mt-1 mt-1">
          {shop.articles?.slice(0, 3).map((article, index) => {
            const hideOnXs = index >= 4 ? "hidden sm:block" : "";
            return (
              <img
                key={index}
                className={`${hideOnXs} w-full aspect-[12/16] border object-cover`}
                src={article?.article_image ?? biscuit50}
              />
            );
          })}
        </div> */}
        {shop.numberOfArticles > 4 && (
          <div className="absolute right-0 sm:right-5 bottom-0 bg-gray-100 text-gray-500 font-bold text-md p-2 rounded-ss-md border-2 sm:hidden">
            {`+${shop.numberOfArticles - 4}`}
          </div>
        )}
        {shop.numberOfArticles > 3 && (
          <div className="absolute right-0 sm:right-5 bottom-0 bg-gray-100 text-gray-500 font-bold text-md p-2 rounded-ss-md border-2 hidden sm:block">
            {`+${shop.numberOfArticles - 3}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeShop;
