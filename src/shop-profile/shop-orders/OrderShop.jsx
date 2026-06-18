import { CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";
import { markOrderAsRead } from "@/services/orders/ordersList";

const OrderShop = ({ order, index }) => {
  const [currentState, setCurrentState] = useState(order.order_state);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRead, setIsRead] = useState(order.is_read ?? true);

  const handleToggleExpand = async () => {
    const opening = !isExpanded;
    setIsExpanded(opening);

    // Mark as read the first time the shop opens/expands the order
    if (opening && !isRead) {
      try {
        await markOrderAsRead(order.id);
        setIsRead(true);
      } catch (err) {
        console.error("Failed to mark order as read:", err.message);
      }
    }
  };

  const updateOrderState = async (newState) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ order_state: newState })
        .eq("id", order.id)
        .select();

      if (error) throw error;
      toast.success(
        `Order ${newState === "accepted" ? "accepted" : "rejected"}`,
      );
      setCurrentState(newState);
    } catch (error) {
      toast.error("Failed to update order");
      console.error("Error updating order:", error.message);
    }
  };

  return (
    <div
      className={`w-full border rounded-[4px] transition-all duration-200 ${
        !isRead
          ? "border-blue-400 bg-blue-50 shadow-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`flex justify-between items-center p-2 cursor-pointer select-none transition-colors duration-150 ${
          !isRead ? "hover:bg-blue-100" : "hover:bg-gray-50"
        }`}
        onClick={handleToggleExpand}
      >
        <div className="flex items-center gap-2">
          {/* Unread dot indicator */}
          {!isRead && (
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
          )}
          <div>
            <h1
              className={`text-sm ${!isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
            >
              Commande numero : {index}
            </h1>
            <h1
              className={`text-sm ${!isRead ? "font-semibold text-gray-700" : "text-gray-500"}`}
            >
              Order Date: {dayjs(order.order_date).format("DD/MM/YYYY HH:mm")}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentState === "pending" ? (
            <div className="flex gap-2 items-center">
              <h1 className="text-sm hidden sm:block">
                (De preference d'appeler le client avant de confirmer.)
              </h1>
              <button
                className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOrderState("accepted");
                }}
              >
                <CheckCircle size={18} />
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-300 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOrderState("rejected");
                }}
              >
                <XCircle size={18} />
              </button>
            </div>
          ) : (
            <h1
              className={`text-sm font-medium rounded py-1 px-3 border ${
                currentState === "accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {currentState}
            </h1>
          )}
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <>
          <hr />
          <div className="grid grid-cols-4 gap-4">
            {order?.order_items?.map((item, idx) => (
              <div className="px-2 py-4" key={idx}>
                <div className="relative group">
                  <img
                    src={item.articles.article_image}
                    className="w-full aspect-square object-cover"
                    alt="Product"
                  />
                  <div className="absolute top-0 right-0 left-0 h-8 p-1 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                    <p className="text-center text-sm">
                      {item.articles.article_price} dt par{" "}
                      {item.articles.article_type}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <h1 className="text-sm">
                    quantité : {item.quantity} {item.articles.article_type}
                  </h1>
                  <h1 className="text-sm">
                    Prix totale : {item.quantity * item.articles.article_price}{" "}
                    dt
                  </h1>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full p-2 border-t border-gray-300">
            <div className="grid grid-cols-3 gap-1">
              <h1 className="text-sm">
                Client : {order?.users.full_name || "deleted acount"}
              </h1>
              <h1 className="text-sm text-center">
                Date de besoin :{" "}
                <span className="text-red-500">
                  {dayjs(order?.user_needed_date).format("DD/MM/YYYY") ||
                    "DD/MM/YYYY"}
                </span>
              </h1>
              <h1 className="text-sm text-end">
                Prix totale : {order?.order_total_amount} dt
              </h1>
              <h1 className="text-sm">
                {order?.user_phone_number
                  ? `Numero de client : ${order?.user_phone_number}`
                  : ""}
              </h1>
              <h1 className="text-sm text-center">
                Mode de récupération :{" "}
                <span>
                  {order?.delivery_type === "livraison"
                    ? "Livraison"
                    : "Sur place"}
                </span>
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderShop;
