import React from "react";

const DeliveryMan = ({ deliveryMan }) => {
  return (
    <div className="flex flex-col">
      <img
        src={deliveryMan.image}
        alt={deliveryMan.name}
        className="w-full aspect-square object-cover"
      />
      <div>
        <h1>{deliveryMan.name}</h1>
        <p>{deliveryMan.phone}</p>
      </div>
    </div>
  );
};

export default DeliveryMan;
