import { Link } from "react-router-dom";
import dyari from "@/assets/dyari.svg";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { AuthContext } from "@/AuthProvider";
import { useContext } from "react";
const DyariLogo = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="absolute hidden sm:flex w-full justify-between items-center top-4 sm:pl-2 pl-2 sm:pr-2 z-10">
        <Link to={"/"} className="flex items-end gap-1">
          <img className="w-7" src={dyari} />
          <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
        </Link>
        <div>
          {user ? (
            <div>
              <Link
                className="px-2 pb-1 rounded-lg border-2 text-amber-700 border-amber-500 hidden sm:block"
                to={"/compte"}
              >
                Compte
              </Link>
            </div>
          ) : (
            <div>
              <Link
                className="px-2 pb-1 rounded-lg border-2 text-amber-700 border-amber-500 hidden sm:block"
                to={"/connexion"}
              >
                se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
      <header className="block sticky top-0 z-30 bg-white border-b border-gray-200 sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Right: placeholder for symmetry */}
          <div className="w-9 h-9" />
          {/* Center: logo */}
          <Link to={"/"} className="flex items-center gap-1">
            <img className="w-7" src={dyari} />
            <h1 className="text-2xl font-bold text-amber-800">Dyari</h1>
          </Link>
          {/* Left: search icon as filter hint */}
          <Link
            to={user ? "/compte" : "/connexion"}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700"
          >
            <PermIdentityIcon style={{ fontSize: "1.2rem" }} />
          </Link>
        </div>
      </header>
    </>
  );
};

export default DyariLogo;
