import React from "react";
import DeliveryMan from "./DeliveryMan";
import deliveryguy from "@/assets/deliveryguy.jfif";
const DeliveryMen = () => {
  const deliveryMen = [
    {
      name: "Ahmed",
      phone: "0123456789",
      image: deliveryguy,
    },
    {
      name: "Mohamed",
      phone: "0123456788",
      image: deliveryguy,
    },
    {
      name: "Ali",
      phone: "0123456787",
      image: deliveryguy,
    },
    {
      name: "Omar",
      phone: "0123456786",
      image: deliveryguy,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-6 px-20">
        {deliveryMen.map((deliveryMan) => (
          <DeliveryMan key={deliveryMan.name} deliveryMan={deliveryMan} />
        ))}
      </div>
    </div>
  );
};

export default DeliveryMen;
