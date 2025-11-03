import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import ShopsHomeSkeleton from "../skeleton/ShopsHomeSkeleton";
import ShopHome from "./ShopHome";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { fetchShops } from "../services/shops/ShopsList";
import CategoriesTabs from "../components/tabs/CategoriesTabs";
import LocalisationFilter from "../components/LocalisationFilter";
import EmptyShopState from "../components/EmptyShopsState";
const ShopsHome = () => {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localisation, setLocalisation] = useState("Toute la Tunisie");
  const [type, setType] = useState("");
  const limit = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [navbarElement, setNavbarElement] = useState(type || "");

  useEffect(() => {
    const query = {};

    if (type) query.type = type;
    if (localisation !== "Toute la Tunisie") query.localisation = localisation;
    if (page !== 1) query.page = page;

    Object.keys(query).length > 0 ? setSearchParams(query) : navigate("/");
  }, [type, localisation, page]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "shops",
      {
        type,
        localisation,
        page,
        limit,
        shopId: user && user.role === "shop" ? user.id : null,
      },
    ],
    queryFn: fetchShops,
    keepPreviousData: true,
  });
  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);
  if (isLoading)
    return (
      <>
        <CategoriesTabs
          type={type}
          navbarElement={navbarElement}
          setType={setType}
          setNavbarElement={setNavbarElement}
          setLocalisation={setLocalisation}
        />
        <ShopsHomeSkeleton />
      </>
    );
  if (isError)
    return (
      <>
        <CategoriesTabs
          type={type}
          navbarElement={navbarElement}
          setType={setType}
          setNavbarElement={setNavbarElement}
          setLocalisation={setLocalisation}
        />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-red-500 text-lg font-semibold">
            Oops! Something went wrong while loading shops.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100"
          >
            Retry
          </button>
        </div>
      </>
    );
  return (
    <>
      <CategoriesTabs
        type={type}
        navbarElement={navbarElement}
        setType={setType}
        setNavbarElement={setNavbarElement}
        setLocalisation={setLocalisation}
      />
      <LocalisationFilter
        localisation={localisation}
        setLocalisation={setLocalisation}
      />
      <div>
        {data?.shops?.length > 0 ? (
          <div className="lg:grid-cols-2 md:grid-cols-2 grid grid-cols-1 gap-16 sm:mx-20 sm:mt-4">
            {data?.shops?.map((shop) => (
              <ShopHome key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <EmptyShopState />
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={() => page > 1 && setPage(page - 1)}
        onNext={() => page < totalPages && setPage(page + 1)}
      />
    </>
  );
};

export default ShopsHome;
