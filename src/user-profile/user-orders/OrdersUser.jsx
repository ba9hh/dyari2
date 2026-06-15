import OrderUser from "./OrderUser";
import { useState, useEffect } from "react";
import thinking from "@/assets/thinking.png";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import OrdersTabs from "@/components/tabs/OrdersTabs";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/Pagination";
import OrdersSkeleton from "@/skeleton/user-profile/OrdersSkeleton";
import { fetchUserOrders } from "@/services/orders/ordersList";
import { useQuery } from "@tanstack/react-query";

const OrdersUser = ({ userId }) => {
  console.log(userId);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 5;
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { t } = useTranslation();
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
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
  console.log(ordersData);
  if (isError) console.error(error);
  if (isLoading) {
    return (
      <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pb-3 pt-2">
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
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pb-2 pt-0">
      <OrdersTabs
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        t={t}
      />
      <div className="flex flex-col gap-2 p-2">
        {ordersData?.orders?.map((order, index) => (
          <OrderUser order={order} key={index} />
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
          {/* <div className="text-5xl mb-4">🛒</div> */}
          {/* <img src={thinking} className="h-16 w-16 mb-4" /> */}

          <h2 className="text-2xl font-semibold mb-2">
            Aucune commande pour le moment
          </h2>
          <p className="text-center max-w-sm">
            Il semble que vous n’ayez encore passé aucune commande.
          </p>
        </div>
      )}
      {ordersData?.orders?.length == 0 && selectedFilter !== "all" && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 ">
          {/* <div className="text-5xl mb-4">🛒</div> */}
          {/* <img src={thinking} className="h-16 w-16 mb-4" /> */}

          <h2 className="text-2xl font-semibold mb-2">
            Aucune commande {selectedFilter}
          </h2>
          <p className="text-center max-w-sm">
            Il semble que vous n’ayez encore passé aucune commande{" "}
            {selectedFilter}.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersUser;
