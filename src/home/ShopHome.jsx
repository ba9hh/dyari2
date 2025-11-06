import ReactStars from "react-rating-stars-component";
import biscuit50 from "../assets/biscuit50.jpg";
import { useNavigate } from "react-router-dom";
import { formatSpeciality } from "../utils/formatSpeciality";
const ShopHome = ({ shop }) => {
  const navigate = useNavigate();
  const openShop = () => {
    navigate("/shop", { state: shop?.id });
  };
  return (
    <div
      className="bg-white sm:shadow-md py-3 sm:pt-3 sm:pb-5 sm:rounded-md sm:border-b-0 border-b-[4px] border-gray-300 cursor-pointer"
      onClick={() => openShop()}
    >
      <div className="flex justify-between items-center sm:px-5 px-3">
        <div className="flex relative flex-1 gap-2">
          <img
            className="w-10 h-10 rounded-full border object-cover"
            src={shop.profile_picture}
            alt="Shop Profile"
          />
          <div>
            <h1 className="my-0 truncate">
              {shop.name} {shop.last_name} ({shop.localisation})
            </h1>
            {shop.speciality?.length > 0 && (
              <span className="crimsonText inline-block my-0 truncate">
                {formatSpeciality(shop.speciality)}
              </span>
            )}

            {/* <div className="overflow-x-auto sm:max-w-full max-w-[200px] whitespace-nowrap scrollbar-hide">
              <h1 className="my-0">
                {shop.name} {shop.last_name} ({shop.localisation})
              </h1>
            </div>
            <div className="overflow-x-auto sm:max-w-full max-w-[200px] whitespace-nowrap scrollbar-hide">
              {shop.speciality?.length > 0 && (
                <span className="crimsonText inline-block my-0">
                  {formatSpeciality(shop.speciality)}
                </span>
              )}
            </div> */}
          </div>
        </div>
        <div className="flex items-center ">
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
      </div>
      <div className="relative sm:px-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:mt-1 mt-3  ">
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
        </div>
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

export default ShopHome;
