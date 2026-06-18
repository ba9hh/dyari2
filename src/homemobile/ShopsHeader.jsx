import React from "react";
import dyari from "@/assets/dyari.svg";

const ShopsHeader = () => {
  return (
    <div className="flex items-center mb-4 sm:mb-6 px-3 sm:px-0">
      <img src={dyari} className="w-5 sm:w-7 flex-shrink-0" />
      <div className="flex-grow border-t border-gray-300 mx-3 sm:mx-6"></div>
      <h1 className="text-sm sm:text-lg font-bold text-gray-600 flex items-center gap-1 text-center whitespace-nowrap">
        <span className="underline">Bienvenue </span>
        {/* <span className="text-amber-600"> faits maison </span> */}
        <span className="underline">à Dyari</span>
        <img
          src="https://flagcdn.com/tn.svg"
          width="20"
          alt="Tunisia"
          className="ml-1"
        />
      </h1>
      <span className="flex-grow border-t border-gray-300 mx-3 sm:mx-6"></span>
      <img src={dyari} className="w-5 sm:w-7 flex-shrink-0" />
    </div>
  );
};

export default ShopsHeader;
