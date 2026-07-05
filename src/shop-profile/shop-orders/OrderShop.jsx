import { CheckCircle, XCircle, PackageCheck } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";
import { markOrderAsRead } from "@/services/orders/ordersList";

const OrderShop = ({ order, index }) => {
  const [currentState, setCurrentState] = useState(order.order_state);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRead, setIsRead] = useState(order.is_read ?? true);
  const [shopConfirmed, setShopConfirmed] = useState(
    order.shop_confirmed_delivery ?? false,
  );

  const handleToggleExpand = async () => {
    const opening = !isExpanded;
    setIsExpanded(opening);

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
        `Commande ${newState === "accepted" ? "acceptée" : "rejetée"}`,
      );
      setCurrentState(newState);
    } catch (error) {
      toast.error("Échec de la mise à jour");
      console.error("Error updating order:", error.message);
    }
  };

  const confirmDelivery = async () => {
    try {
      // Mark shop as confirmed
      const { data: updated, error: updateError } = await supabase
        .from("orders")
        .update({ shop_confirmed_delivery: true })
        .eq("id", order.id)
        .select("user_confirmed_delivery")
        .single();

      if (updateError) throw updateError;

      setShopConfirmed(true);

      // If user already confirmed, mark as delivered
      if (updated.user_confirmed_delivery) {
        const { error: stateError } = await supabase
          .from("orders")
          .update({ order_state: "delivered" })
          .eq("id", order.id);

        if (stateError) throw stateError;
        setCurrentState("delivered");
        toast.success("Commande marquée comme livrée !");
      } else {
        toast.success("Confirmation enregistrée. En attente du client.");
      }
    } catch (error) {
      toast.error("Échec de la confirmation");
      console.error("Error confirming delivery:", error.message);
    }
  };

  return (
    <div
      className={`w-full rounded-md border transition-all duration-200 ${
        !isRead
          ? "border-amber-400 bg-amber-50 shadow-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Header row */}
      <div
        className={`flex justify-between items-center px-3 py-2.5 cursor-pointer select-none transition-colors duration-150 rounded-t-md ${
          !isRead ? "hover:bg-amber-100" : "hover:bg-gray-50"
        }`}
        onClick={handleToggleExpand}
      >
        {/* Left: unread dot + order info */}
        <div className="flex items-center gap-2">
          {!isRead && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          )}
          <div>
            <h1
              className={`text-sm ${
                !isRead
                  ? "font-bold text-gray-900"
                  : "font-medium text-gray-700"
              }`}
            >
              Commande n° {index}
            </h1>
            <h1
              className={`text-xs ${
                !isRead ? "font-semibold text-gray-600" : "text-gray-400"
              }`}
            >
              {dayjs(order.order_date).format("DD/MM/YYYY HH:mm")}
            </h1>
          </div>
        </div>

        {/* Right: action buttons or state badge + chevron */}
        <div className="flex items-center gap-2">
          {currentState === "pending" ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:block">
                Appeler le client avant de confirmer
              </span>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-full shadow-sm transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOrderState("accepted");
                }}
              >
                <CheckCircle size={15} />
                <span className="hidden sm:inline">Accepter</span>
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-red-50 text-red-500 border border-red-300 text-xs font-semibold rounded-full shadow-sm transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOrderState("rejected");
                }}
              >
                <XCircle size={15} />
                <span className="hidden sm:inline">Rejeter</span>
              </button>
            </div>
          ) : currentState === "accepted" ? (
            <div className="flex items-center gap-2">
              {!shopConfirmed ? (
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-full shadow-sm transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelivery();
                  }}
                >
                  <PackageCheck size={15} />
                  <span className="hidden sm:inline">Confirmer livraison</span>
                </button>
              ) : (
                <span className="text-xs font-semibold rounded-full py-1 px-3 border bg-green-50 text-green-700 border-green-200">
                  ✓ Votre confirmation enregistrée
                </span>
              )}
            </div>
          ) : (
            <span
              className={`text-xs font-semibold rounded-full py-1 px-3 border ${
                currentState === "delivered"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {currentState === "delivered" ? "Livrée" : "Rejetée"}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <>
          <hr className="border-gray-100" />

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3">
            {order?.order_items?.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-gray-100 overflow-hidden bg-gray-50"
              >
                <div className="relative group">
                  <img
                    src={item.articles.article_image}
                    className="w-full aspect-square object-cover"
                    alt="Product"
                  />
                  <div className="absolute inset-x-0 top-0 h-8 p-1 bg-white/90 border-b border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-center text-xs text-gray-600">
                      {item.articles.article_price} dt /{" "}
                      {item.articles.article_type}
                    </p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500">
                    Qté : {item.quantity} {item.articles.article_type}
                  </p>
                  <p className="text-xs font-semibold text-amber-600">
                    {item.quantity * item.articles.article_price} dt
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary footer */}
          <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50 rounded-b-md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Client
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {order?.users?.full_name || "Compte supprimé"}
                </span>
                {order?.user_phone_number && (
                  <span className="text-xs text-gray-500">
                    {order.user_phone_number}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-0.5 sm:items-center">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Date souhaitée
                </span>
                <span className="text-sm font-semibold text-amber-600">
                  {dayjs(order?.user_needed_date).format("DD/MM/YYYY")}
                </span>
                <span className="text-xs text-gray-500">
                  {order?.delivery_type === "livraison"
                    ? "Livraison"
                    : "Sur place"}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 sm:items-end">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Total
                </span>
                <span className="text-base font-bold text-amber-600">
                  {order?.order_total_amount} dt
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderShop;
