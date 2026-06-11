import React from "react";
import dyari from "@/assets/dyari.svg";

const ShopsHeader = () => {
  return (
    <div className="flex items-center mb-6">
      <img src={dyari} className="w-7" />
      <div className="flex-grow border-t border-gray-300 mx-6"></div>
      <h1 className="sm:text-lg font-bold text-gray-600 flex items-center gap-1.5">
        <span className="underline">Decouvrir les meilleurs</span>
        <span className="text-amber-600 no-underline"> faits maison </span>
        <span className="underline">à Dyari</span>
        <img
          src="https://flagcdn.com/tn.svg"
          width="24"
          alt="Tunisia"
          className="ml-0.5"
        />
      </h1>
      <span className="flex-grow border-t border-gray-300 mx-6"></span>
      <img src={dyari} className="w-7" />
    </div>
  );
};

export default ShopsHeader;
