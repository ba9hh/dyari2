import { Link } from "react-router-dom";
import dyari from "@/assets/dyari.svg";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import filters from "@/assets/filters.svg";
import { AuthContext } from "@/AuthProvider";
import { useContext } from "react";
const DyariLogo = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="absolute hidden md:flex w-full justify-between items-end top-4 sm:pl-8 pl-2 sm:pr-4 z-10">
        <Link to={"/"} className="flex items-center gap-1">
          <img className="w-7" src={dyari} />
          <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
        </Link>
        <div>
          {user ? (
            <div>
              <Link
                className="px-2 pb-1 rounded-lg border-2 text-amber-700 border-amber-500 shadow-lg hidden sm:block"
                to={"/account"}
              >
                {/* {t("navbar.login")} */}
                account
              </Link>
            </div>
          ) : (
            <div>
              <Link
                className="px-2 pb-1 rounded-lg border-2 text-amber-700 border-amber-500 shadow-lg hidden sm:block"
                to={"/auth"}
              >
                {/* {t("navbar.login")} */}
                se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
      <header className="sm:hidden w-full block absolute top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-stone-200/60">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-4 px-4 py-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center bg-white py-2 px-3 rounded-2xl gap-2 w-fit">
            <img className=" h-4 w-4 text-stone-500" src={filters} />
          </div>
          <Link to={"/"} className="flex items-center justify-center gap-1">
            <img className="w-7" src={dyari} />
            <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
          </Link>
          <div className="flex justify-end">
            <Link
              to={"/auth"}
              className=" rounded-full p-1 text-gray-600  block sm:hidden w-fit"
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
