import { FormControl, Select, MenuItem } from "@mui/material";
import cities from "@/data/cities";
import searchIcon from "@/assets/search.svg";
import filters from "@/assets/filters.svg";
import location from "@/assets/location.svg";

const LocalisationFilter = ({
  localisation,
  setLocalisation,
  search,
  setSearch,
}) => {
  return (
    <>
      {/* Desktop */}
      <div className="sm:flex justify-between pb-3 px-2 hidden ">
        <div className="flex gap-2 items-center">
          <div className="flex items-center bg-white py-1.5 px-2 rounded-[4px] border border-stone-300 hover:border-stone-400 gap-2">
            <img className=" h-4 w-4 text-stone-400" src={searchIcon} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="outline-none placeholder:text-stone-400 text-sm w-48"
            />
          </div>
          {/* <div className="flex items-center bg-white py-2 px-3 rounded-[4px] border border-stone-300 gap-2">
            <img className=" h-4 w-4 text-stone-400" src={filters} />
            <h1 className="text-stone-500 text-sm">Filters</h1>
          </div> */}
        </div>
        <div className="relative w-40">
          <img
            src={location}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
          />
          <select
            name="localisation"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className="h-[36px] pl-9 text-stone-600 text-[#1c1e21] rounded-[4px] px-[8px] border border-stone-300 hover:border-stone-400 w-full cursor-pointer outline-none appearance-none text-sm"
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
      <hr className="sm:block hidden bg-gray-600 mt-4" />
      {/* Mobile */}
      <div className="block mx-0.5 sm:hidden">
        <div className="relative w-full mt-0.5">
          {/* <img
            src={location}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
          /> */}
          <select
            name="localisation"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className="h-fit text-center text-sm flex justify-center text-stone-500 px-[8px] py-3 border border-stone-300 w-full cursor-pointer outline-none appearance-none bg-white"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
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
    </>
  );
};

export default LocalisationFilter;
