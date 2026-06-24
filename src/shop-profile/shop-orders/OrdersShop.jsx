import { useState, useEffect } from "react";
import OrderShop from "./OrderShop";
import { useTranslation } from "react-i18next";
import thinking from "@/assets/thinking.png";
import OrdersTabs from "@/components/tabs/OrdersTabs";
import OrdersSkeleton from "@/skeleton/user-profile/OrdersSkeleton";
import Pagination from "@/components/Pagination";
import { fetchShopOrders } from "@/services/orders/ordersList";
import { useQuery } from "@tanstack/react-query";
const OrdersShop = ({ shopId }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { t } = useTranslation();
  const LIMIT = 5;
  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", { shopId, page, limit: LIMIT }],
    queryFn: fetchShopOrders,
    keepPreviousData: true,
    enabled: !!shopId,
  });
  useEffect(() => {
    if (ordersData?.totalPages) {
      setTotalPages(ordersData.totalPages);
    }
  }, [ordersData]);
  if (isLoading) {
    return (
      <div className="w-2/3 bg-white shadow-md rounded-md pb-3 pt-2">
        <OrdersTabs
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          t={t}
        />
        <OrdersSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full sm:w-2/3 bg-white shadow-sm rounded-md pb-2 pt-0 sm:border">
      <OrdersTabs
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        t={t}
      />
      <div className="flex flex-col gap-2 p-2">
        {ordersData?.orders?.map((order, index) => (
          <OrderShop
            order={order}
            key={order.id}
            index={ordersData.totalOrders - ((page - 1) * LIMIT + index)}
          />
        ))}
      </div>
      {ordersData?.orders?.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => page > 1 && setPage(page - 1)}
          onNext={() => page < totalPages && setPage(page + 1)}
        />
      )}
      {ordersData?.orders?.length == 0 && selectedFilter == "all" && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          {/* <img src={thinking} className="h-16 w-16 mb-4" /> */}
          <h2 className="text-2xl font-semibold mb-2">
            Aucune commande pour le moment
          </h2>
          <p className="text-center max-w-md">
            Vous n’avez aucune commande pour le moment. Dès que des clients
            passeront des commandes, elles apparaîtront ici pour que vous
            puissiez les gérer.
          </p>
        </div>
      )}
      {ordersData?.orders?.length == 0 && selectedFilter !== "all" && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
          {/* <img src={thinking} className="h-16 w-16 mb-4" /> */}
          <h2 className="text-2xl font-semibold mb-2">
            No {selectedFilter} Orders
          </h2>
          <p className="text-center max-w-sm">
            Looks like you dont’t have any {selectedFilter} orders.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersShop;
