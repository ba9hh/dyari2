import { FormControl, Select, MenuItem } from "@mui/material";
import cities from "../data/cities";
import search from "../assets/search.svg";

const LocalisationFilter = ({ localisation, setLocalisation }) => {
  return (
    <>
      {/* Desktop */}
      <div className="sm:flex justify-between py-3 px-8 hidden">
        <div className="flex items-center bg-white py-2 px-3 rounded-2xl border-2 gap-2">
          <img className=" h-4 w-4 text-stone-500" src={search} />
          <input
            placeholder="Search shops"
            className="outline-none placeholder:text-stone-400 text-sm w-52"
          />
          {/* <h1 className="text-stone-400 text-sm w-52">Search shops</h1> */}
        </div>
        <select
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
        </select>
      </div>
      {/* Mobile */}
      <div className="block sm:hidden">
        <FormControl fullWidth>
          <Select
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default LocalisationFilter;
