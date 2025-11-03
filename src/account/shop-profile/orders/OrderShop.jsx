import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";

const OrderShop = ({ order, index }) => {
  const [currentState, setCurrentState] = useState(order.order_state);
  const updateOrderState = async (newState) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ order_state: newState })
        .eq("id", order.id) // replace with your PK column
        .select();

      if (error) throw error;
      toast.success(
        `Order ${newState == "accepted" ? "accepted" : "rejected"} `
      );
      setCurrentState(newState);
    } catch (error) {
      toast.error("Failed to update order");
      console.error("Error updating order:", error.message);
    }
  };
  return (
    <div className="w-full border rounded-[4px] p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-sm font-medium">Commande numero : {index}</h1>
          <h1 className="text-sm text-gray-600">
            Order Date: {dayjs(order.order_date).format("DD/MM/YYYY HH:mm")}
          </h1>
        </div>
        {currentState === "pending" ? (
          <div className="flex gap-2">
            <h1 className="text-sm">
              (Veuillez appeler le client avant de confirmer.)
            </h1>
            <button
              className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-1"
              onClick={() => updateOrderState("accepted")}
            >
              <CheckCircle size={18} />
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-300 flex items-center gap-1"
              onClick={() => updateOrderState("rejected")}
            >
              <XCircle size={18} />
            </button>
          </div>
        ) : (
          <h1
            className={`text-sm font-medium rounded py-1 px-3 border ${
              currentState == "accepted"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {currentState}
          </h1>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {order?.order_items?.map((item, idx) => (
          <div className="p-3" key={idx}>
            <div className="relative group">
              <img
                src={item.articles.article_image}
                className="w-full aspect-[11/16] object-cover"
                alt="Product"
              />
              <div className="absolute top-0 right-0 left-0 h-8 p-1 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <p className="text-center text-sm">
                  {item.articles.article_price} dt par{" "}
                  {item.articles.article_type}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-sm">
                quantité : {item.quantity} {item.articles.article_type}
              </h1>
              <h1 className="text-sm">
                Prix totale : {item.quantity * item.articles.article_price} dt
              </h1>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end py-2 px-1 border-t border-gray-300">
        <div>
          <h1 className="text-sm">
            Client : {order?.users.name || "deleted acount"}
          </h1>
          <h1 className="text-sm">
            {order?.user_phone_number
              ? `Numero de client : ${order?.user_phone_number}`
              : ""}
          </h1>
          <h1 className="text-sm">
            Date de besoin :{" "}
            <span className="text-red-500">
              {dayjs(order?.user_needed_date).format("DD/MM/YYYY") ||
                "DD/MM/YYYY"}
            </span>
          </h1>
          <h1 className="text-sm">
            Prix totale : {order?.order_total_amount} dt
          </h1>
        </div>
      </div>
    </div>
  );
};

export default OrderShop;
