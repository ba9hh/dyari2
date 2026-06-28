import dyari from "@/assets/dyari.svg";

const ShopsHeader = () => {
  return (
    <div className="flex items-center mb-4 sm:mb-6 sm:mt-3 px-3 sm:px-0 mt-3 border-b">
      <img src={dyari} className="hidden sm:block w-5 sm:w-7 flex-shrink-0" />
      <div className="flex-grow border-t-0 sm:border-t border-gray-300 mx-0 sm:mx-6"></div>
      <h1 className="text-lg sm:text-lg font-bold text-gray-600 flex items-center sm:gap-1 text-center whitespace-nowrap">
        <span className="">
          Bienvenue à <span className="underline text-amber-600">Dyari</span>
          <div className="font-thin text-base">
            Découvrir et Commander les meilleurs faits maison
          </div>{" "}
          {/* <span className="underline text-amber-600">meilleur</span> */}
        </span>
        {/* <img
          src="https://flagcdn.com/tn.svg"
          width="20"
          alt="Tunisia"
          className="ml-1"
        /> */}
      </h1>
      <span className="flex-grow border-t-0 sm:border-t border-gray-300 mx-0 sm:mx-6"></span>
      <img src={dyari} className="hidden sm:block w-5 sm:w-7 flex-shrink-0" />
    </div>
  );
};

export default ShopsHeader;
