import RatedShop from "./RatedShop";
import { fetchRatedShops } from "@/services/shops/ratedShops";
import { useQuery } from "@tanstack/react-query";
import RatedShopsSkeleton from "@/skeleton/user-profile/RatedShopsSkeleton";

const RatedShops = ({ userId }) => {
  const {
    data: ratedShops,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["ratedShops", userId],
    queryFn: () => fetchRatedShops(userId),
  });

  if (isLoading) return <RatedShopsSkeleton />;

  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md py-2 sm:py-3">
      <div className="flex flex-col px-1 sm:px-3 gap-2">
        {ratedShops?.length > 0 ? (
          ratedShops.map((shop) => (
            <RatedShop key={shop.id} shop={shop} userId={userId} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <h2 className="text-2xl font-semibold mb-2">
              Aucun avis laissé pour le moment
            </h2>
            <p className="text-center max-w-lg">
              Vous n'avez encore évalué aucune boutique. Une fois que vous aurez
              laissé un avis, il apparaîtra ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatedShops;
