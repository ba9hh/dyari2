import OrderUser from "./OrderUser";
import { useState, useEffect } from "react";
import OrdersTabs from "@/components/tabs/OrdersTabs";
import Pagination from "@/components/Pagination";
import OrdersSkeleton from "@/skeleton/user-profile/OrdersSkeleton";
import { fetchUserOrders } from "@/services/orders/ordersList";
import { useQuery } from "@tanstack/react-query";

const OrdersUser = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 5;
  const [selectedFilter, setSelectedFilter] = useState("all");

  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", { userId, page, limit: LIMIT }],
    queryFn: fetchUserOrders,
    keepPreviousData: true,
    enabled: !!userId,
  });

  useEffect(() => {
    if (ordersData?.totalPages) {
      setTotalPages(ordersData.totalPages);
    }
  }, [ordersData]);

  if (isLoading) {
    return (
      <div className="w-full sm:w-2/3 bg-white/80 shadow-sm sm:rounded-md border border-gray-200 pb-3 pt-0">
        <OrdersTabs
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <OrdersSkeleton />
      </div>
    );
  }

  return (
    <>
      {/* Orders list */}
      <div className="w-full sm:w-2/3 bg-white/80 shadow-sm sm:rounded-md border border-gray-200 pb-2 pt-0">
        <OrdersTabs
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <div className="flex flex-col gap-2 p-2 sm:p-4">
          {ordersData?.orders?.map((order, index) => (
            <OrderUser
              order={order}
              key={order.id}
              index={ordersData.totalOrders - ((page - 1) * LIMIT + index)}
            />
          ))}
        </div>

        {ordersData?.orders?.length === 0 && selectedFilter === "all" && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-gray-500">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">
              Aucune commande pour le moment
            </h2>
            <p className="text-sm text-center max-w-sm text-gray-400">
              Il semble que vous n'ayez encore passé aucune commande.
            </p>
          </div>
        )}

        {ordersData?.orders?.length === 0 && selectedFilter !== "all" && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-gray-500">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">
              Aucune commande « {selectedFilter} »
            </h2>
            <p className="text-sm text-center max-w-sm text-gray-400">
              Il semble que vous n'ayez encore passé aucune commande{" "}
              {selectedFilter}.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {ordersData?.orders?.length > 0 && (
        <div className="w-full sm:w-2/3 bg-white sm:shadow-sm sm:rounded-md">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={() => page > 1 && setPage(page - 1)}
            onNext={() => page < totalPages && setPage(page + 1)}
          />
        </div>
      )}
    </>
  );
};

export default OrdersUser;
