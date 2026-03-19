import React from "react";

const DeliveryMan = ({ deliveryMan }) => {
  return (
    <div className="flex flex-col">
      {/* <div className="border-4 p-1 border-stone-300"> */}
      <img
        src="https://media.gettyimages.com/id/1512443289/fr/photo/portrait-de-motoboy.jpg?s=612x612&w=gi&k=20&c=8baA6jBtHfzXSm5bmD15M6p22ZdRlWRfjjL96yKItf4="
        alt={deliveryMan.name}
        className="w-full aspect-square object-cover"
      />
      {/* </div> */}
      <div className="flex justify-between items-center border-b py-1">
        <div className="">
          <h1 className="text-gray-700 font-semibold">{deliveryMan.name}</h1>
          <h1 className="font-serif text-gray-600">Gabes</h1>
        </div>
        <p className="font-medium text-gray-500">{deliveryMan.phone}</p>
      </div>
    </div>
  );
};

export default DeliveryMan;
