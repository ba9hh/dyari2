import React from "react";
import DeliveryMan from "./DeliveryMan";
import deliveryguy from "@/assets/deliveryguy.jfif";
const DeliveryMen = () => {
  const deliveryMen = [
    {
      name: "Ahmed",
      phone: "27 428 425",
      image: deliveryguy,
    },
    {
      name: "Mohamed",
      phone: "27 428 425",
      image: deliveryguy,
    },
    {
      name: "Ali",
      phone: "27 428 425",
      image: deliveryguy,
    },
    {
      name: "Omar",
      phone: "27 428 425",
      image: deliveryguy,
    },
    {
      name: "Omar",
      phone: "27 428 425",
      image: deliveryguy,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-6 px-0 mt-8">
        {deliveryMen.map((deliveryMan) => (
          <DeliveryMan key={deliveryMan.name} deliveryMan={deliveryMan} />
        ))}
      </div>
    </div>
  );
};

export default DeliveryMen;
