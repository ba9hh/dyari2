import LikedShop from "./LikedShop";
import thinking from "../../../assets/thinking.png";
import LikedShopsSkeleton from "../../../skeleton/user-profile/LikedShopsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getLikedShops } from "../../../services/shops/likedShops";
const LikedShops = ({ userId }) => {
  const {
    data: likedShops,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["likedShops", userId],
    queryFn: () => getLikedShops(userId),
  });
  if (isLoading) {
    return <LikedShopsSkeleton />;
  }
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md py-2 sm:py-8">
      <div className="flex flex-col px-1 sm:px-3 gap-2">
        {likedShops?.length > 0 ? (
          likedShops.map((likedShop, index) => (
            <div key={index}>
              <LikedShop shop={likedShop} userId={userId} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
            <img src={thinking} className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No Favorite Shops yet
            </h2>
            <p className="text-center max-w-md">
              You don’t have any favorite shops at the moment. Once you like a
              shop , they’ll appear here for you to manage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedShops;
