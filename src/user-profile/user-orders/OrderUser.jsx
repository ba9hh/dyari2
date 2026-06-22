import React, { useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ChevronDown, Eye, EyeOff, PackageCheck } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";

const OrderUser = ({ order, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(
    order.user_confirmed_delivery ?? false,
  );
  const [currentState, setCurrentState] = useState(order.order_state);
  const shopHasRead = order.is_read ?? false;

  const confirmDelivery = async () => {
    try {
      const { data: updated, error: updateError } = await supabase
        .from("orders")
        .update({ user_confirmed_delivery: true })
        .eq("id", order.id)
        .select("shop_confirmed_delivery")
        .single();

      if (updateError) throw updateError;

      setUserConfirmed(true);

      // If shop already confirmed, mark as delivered
      if (updated.shop_confirmed_delivery) {
        const { error: stateError } = await supabase
          .from("orders")
          .update({ order_state: "delivered" })
          .eq("id", order.id);

        if (stateError) throw stateError;
        setCurrentState("delivered");
        toast.success("Commande marquée comme livrée !");
      } else {
        toast.success("Confirmation enregistrée. En attente du vendeur.");
      }
    } catch (error) {
      toast.error("Échec de la confirmation");
      console.error("Error confirming delivery:", error.message);
    }
  };

  return (
    <div className="w-full rounded-md border border-gray-200 bg-white transition-all duration-200">
      {/* Header row */}
      <div
        className="flex justify-between items-center px-3 py-2.5 cursor-pointer select-none hover:bg-gray-50 transition-colors duration-150 rounded-t-md"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {/* Left: order info */}
        <div>
          <h1 className="text-sm font-medium text-gray-700">
            Commande n° {index}
          </h1>
          <h1 className="text-xs text-gray-400">
            {dayjs(order.order_date).format("DD/MM/YYYY HH:mm")}
          </h1>
        </div>

        {/* Right: seen badge + state badge + chevron */}
        <div className="flex items-center gap-2">
          {/* Shop read indicator */}
          <span
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
              shopHasRead
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-gray-50 text-gray-400 border-gray-200"
            }`}
            title={shopHasRead ? "Vue par le vendeur" : "Pas encore vue"}
          >
            {shopHasRead ? <Eye size={12} /> : <EyeOff size={12} />}
            {shopHasRead ? "Vue" : "Non vue"}
          </span>

          <span
            className={`text-xs font-semibold rounded-full py-1 px-3 border ${
              currentState === "accepted"
                ? "bg-green-50 text-green-700 border-green-200"
                : currentState === "rejected"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : currentState === "delivered"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            {currentState === "pending"
              ? "En attente"
              : currentState === "accepted"
                ? "Acceptée"
                : currentState === "delivered"
                  ? "Livrée"
                  : "Rejetée"}
          </span>

          {currentState === "accepted" && (
            <>
              {!userConfirmed ? (
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-full shadow-sm transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelivery();
                  }}
                >
                  <PackageCheck size={15} />
                  <span className="hidden sm:inline">
                    J'ai reçu ma commande
                  </span>
                </button>
              ) : (
                <span className="text-xs font-semibold rounded-full py-1 px-3 border bg-green-50 text-green-700 border-green-200">
                  ✓ Réception confirmée
                </span>
              )}
            </>
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
            {order?.order_items.map((item, idx) => (
              <div
                key={idx}
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
                  Vendeur
                </span>
                {order?.shops ? (
                  <Link
                    className="text-sm font-medium text-amber-600 hover:text-amber-700 underline transition-colors duration-200"
                    to={`/insideshop/${order.shop_id}`}
                  >
                    {order.shops?.business_name}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    Boutique supprimée
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-0.5 sm:items-center">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Date souhaitée
                </span>
                <span className="text-sm font-semibold text-amber-600">
                  {dayjs(order.user_needed_date).format("DD/MM/YYYY")}
                </span>
                <span className="text-xs text-gray-500">
                  {order?.delivery_type === "livraison"
                    ? "Livraison"
                    : " Sur place"}
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

export default OrderUser;
