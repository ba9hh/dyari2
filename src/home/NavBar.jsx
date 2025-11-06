import { useContext } from "react";
import dyari from "../assets/dyari.svg";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { useTranslation } from "react-i18next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SearchIcon from "@mui/icons-material/Search";
import filters from "../assets/filters.svg";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  return (
    <>
      <div className="hidden md:block">
        <div className="h-fit sm:h-12 flex justify-between items-end w-full sm:pl-8 px-2 sm:pr-4 sm:pb-0 py-3">
          <div className="flex items-center gap-1">
            <img className="w-7" src={dyari} />
            <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
          </div>
          <div>
            {user ? (
              <Link to={"/account"}>
                <img
                  src={user ? user.profile_picture : ""}
                  className="rounded-full w-10 h-10 object-cover"
                />
              </Link>
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
      </div>
      <div className="block sm:hidden">
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 dark:supports-[backdrop-filter]:bg-stone-900/60 dark:bg-stone-900/50 border-b border-stone-200/60 dark:border-stone-800">
          <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-4 px-4 py-3 md:grid-cols-[1fr_auto_1fr] border border-yellow-300">
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
      </div>
    </>
  );
};

export default NavBar;
