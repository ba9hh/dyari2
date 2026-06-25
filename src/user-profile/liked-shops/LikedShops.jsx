import LikedShop from "./LikedShop";
import LikedShopsSkeleton from "@/skeleton/user-profile/LikedShopsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getLikedShops } from "@/services/shops/likedShops";

const LikedShops = ({ userId }) => {
  const {
    data: likedShops,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["likedShops", userId],
    queryFn: () => getLikedShops(userId),
  });

  if (isLoading) return <LikedShopsSkeleton />;

  return (
    <div className="w-full sm:w-2/3 bg-white/80 shadow-sm sm:rounded-md border border-gray-200 p-2 sm:p-4">
      <div className="flex flex-col gap-2">
        {likedShops?.length > 0 ? (
          likedShops.map((likedShop, index) => (
            <LikedShop key={index} shop={likedShop} userId={userId} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-gray-500">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">
              Aucun magasin favori pour le moment
            </h2>
            <p className="text-sm text-center max-w-lg text-gray-400">
              Vous n'avez actuellement aucun magasin favori. Une fois que vous
              ajouterez un magasin à vos favoris, il apparaîtra ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedShops;
