import { Link } from "react-router-dom";
import dyari from "../assets/dyari.svg";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import filters from "../assets/filters.svg";

const DyariLogo = () => {
  return (
    <>
      <Link
        className="hidden md:block absolute top-4 sm:left-8 left-2"
        to={"/"}
      >
        <div className="flex items-center gap-1">
          <img className="w-7" src={dyari} />
          <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
        </div>
      </Link>
      <header className="w-full block absolute top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-stone-200/60 sm:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-4 px-4 py-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center bg-white py-2 px-3 rounded-2xl border-2 gap-2 w-fit">
            <img className=" h-4 w-4 text-stone-500" src={filters} />
          </div>
          <div className="flex items-center justify-center gap-1">
            <img className="w-7" src={dyari} />
            <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
          </div>
          <div className="flex justify-end">
            <Link
              to={"/auth"}
              className=" rounded-full p-1 text-gray-600 border-2 block sm:hidden w-fit"
            >
              <PermIdentityIcon style={{ fontSize: "1.6rem" }} />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default DyariLogo;
