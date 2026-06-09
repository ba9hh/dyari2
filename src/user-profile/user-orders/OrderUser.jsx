import React, { useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const OrderUser = ({ order, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full border rounded-[4px] border-gray-300">
      <div
        className="flex justify-between items-center p-2 cursor-pointer select-none hover:bg-gray-50 transition-colors duration-150"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="">
          <h1 className="text-sm font-medium">Commande numero : {index} </h1>
          <h1 className="text-sm text-gray-600">
            Date de commande:{" "}
            {dayjs(order.order_date).format("DD/MM/YYYY HH:mm")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <h1
            className={`text-sm font-medium rounded py-1 px-3 border ${
              order.order_state == "accepted"
                ? "bg-green-100 text-green-700"
                : order.order_state === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.order_state}
          </h1>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {order?.order_items.map((item, idx) => (
              <div className="p-4" key={idx}>
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
                    Quantité : {item.quantity} {item.articles.article_type}
                  </h1>
                  <h1 className="text-sm">
                    Prix totale : {item.quantity * item.articles.article_price}{" "}
                    dt
                  </h1>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end px-2 border-t border-gray-300 py-2">
            <div className="border-l pl-2 border-gray-300">
              <div className="flex items-center gap-1">
                <span className="text-sm">Vendeur :</span>
                {order?.shops ? (
                  <Link
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
                    to={`/insideshop/${order.shopId?.id}`}
                  >
                    {order.shops?.business_name}
                  </Link>
                ) : (
                  <span className="text-sm underline">Shop deleted</span>
                )}
              </div>
              <h1 className="text-sm">
                Date de besoin :{" "}
                <span className="text-red-500">
                  {dayjs(order.user_needed_date).format("DD/MM/YYYY") ||
                    "DD/MM/YYYY"}
                </span>
              </h1>
              <h1 className="text-sm">
                Prix totale : {order?.order_total_amount} dt
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderUser;
