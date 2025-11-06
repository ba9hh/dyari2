import { FormControl, Select, MenuItem } from "@mui/material";
import cities from "../data/cities";
import search from "../assets/search.svg";
import filters from "../assets/filters.svg";
import location from "../assets/location.svg";

const LocalisationFilter = ({ localisation, setLocalisation }) => {
  return (
    <>
      {/* Desktop */}
      <div className="sm:flex justify-between py-3 px-8 hidden">
        <div className="flex gap-2 items-center">
          <div className="flex items-center bg-white py-2 px-3 rounded-2xl border-2 gap-2">
            <img className=" h-4 w-4 text-stone-500" src={search} />
            <input
              placeholder="Search shops"
              className="outline-none placeholder:text-stone-400 text-sm w-52"
            />
            {/* <h1 className="text-stone-400 text-sm w-52">Search shops</h1> */}
          </div>
          <div className="flex items-center bg-white py-2 px-3 rounded-2xl border-2 gap-2">
            <img className=" h-4 w-4 text-stone-500" src={filters} />
            <h1 className="text-stone-700 text-sm">Filters</h1>
          </div>
        </div>
        {/* <select
          name="localisation"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          className="h-[36px] text-stone-600 text-[#1c1e21] rounded-[4px] px-[8px] pr-[20px] border border-stone-400 w-40 cursor-pointer outline-none"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select> */}
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
      {/* Mobile */}
      <div className="block sm:hidden">
        <div className="relative w-full mt-[1px] mx-1">
          <img
            src={location}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
          />
          <select
            name="localisation"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className="h-fit flex justify-center text-[#1c1e21] rounded-[4px] px-[8px] py-3 border border-stone-400 w-full cursor-pointer outline-none appearance-none bg-white"
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
    </>
  );
};

export default LocalisationFilter;
