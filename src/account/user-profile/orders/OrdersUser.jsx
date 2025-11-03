import OrderUser from "./OrderUser";
import { useState, useEffect } from "react";
import thinking from "../../../assets/thinking.png";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import OrdersTabs from "../../../components/tabs/OrdersTabs";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/Pagination";
import OrdersSkeleton from "../../../skeleton/user-profile/OrdersSkeleton";
import { fetchUserOrders } from "../../../services/orders/ordersList";
import { useQuery } from "@tanstack/react-query";

const OrdersUser = ({ userId }) => {
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
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pb-3 pt-2">
      <OrdersTabs
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        t={t}
      />
      {ordersData?.orders?.map((order, index) => (
        <OrderUser order={order} key={index} />
      ))}

      {ordersData?.orders?.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => page > 1 && setPage(page - 1)}
          onNext={() => page < totalPages && setPage(page + 1)}
        />
      )}
      {ordersData?.orders?.length == 0 && selectedFilter == "all" && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
          {/* <div className="text-5xl mb-4">🛒</div> */}
          <img src={thinking} className="h-16 w-16 mb-4" />

          <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-center max-w-sm">
            Looks like you haven’t placed any orders yet. Start exploring our
            shop and enjoy shopping!
          </p>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              px: 3,
              py: 1.5,
              borderRadius: "9999px",
              textTransform: "none",
            }}
          >
            Back home
          </Button>
        </div>
      )}
      {ordersData?.orders?.length == 0 && selectedFilter !== "all" && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
          {/* <div className="text-5xl mb-4">🛒</div> */}
          <img src={thinking} className="h-16 w-16 mb-4" />

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

export default OrdersUser;
