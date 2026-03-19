import React, { useState } from "react";
import location from "@/assets/location.svg";
import scooter from "@/assets/scooter.gif";
import cities from "@/data/cities";

const DeliveryHeader = () => {
  const [localisation, setLocalisation] = useState("");

  return (
    <div>
      <img src={scooter} alt="Scooter" className="mx-auto w-16 h-16" />
      <h1 className="text-center font-serif text-2xl text-stone-700">
        Trouver un livreur près de chez vous
      </h1>
      <h1 className="text-center font-serif text-base text-stone-600">
        Connectez-vous avec des livreurs locaux fiables, prêts à transporter vos
        colis rapidement et en toute sécurité.
      </h1>
      <div className="flex justify-center mt-6">
        <div className="relative w-44">
          <img
            src={location}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
          />
          <select
            name="localisation"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className="h-[36px] pl-9 text-stone-600 text-[#1c1e21] rounded-[4px] px-[8px]  border border-stone-400 w-full cursor-pointer outline-none appearance-none"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHeader;
