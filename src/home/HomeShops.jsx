import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ShopsHomeSkeleton from "@/skeleton/home/ShopsHomeSkeleton";
import HomeShop from "@/home/HomeShop";
import { useSearchParams, useNavigate } from "react-router-dom";
import HomePagination from "./HomePagination";
import { fetchShops } from "@/services/shops/ShopsList";
import CategoriesTabs from "@/home/CategoriesTabs";
import LocalisationFilter from "@/home/LocalisationFilter";
import NavBar from "@/home/NavBar";
import faza from "@/assets/faza2.jpg";
import ShopsHeader from "@/home/ShopsHeader";
import loginbg from "@/assets/loginbg.jpg";

const HomeShops = () => {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localisation, setLocalisation] = useState("Toute la Tunisie");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const limit = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [navbarElement, setNavbarElement] = useState(type || "");

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };
  useEffect(() => {
    const query = {};

    if (type) query.type = type;
    if (localisation !== "Toute la Tunisie") query.localisation = localisation;
    if (search.trim()) query.search = search;
    if (page !== 1) query.page = page;

    setSearchParams(query);
  }, [type, localisation, search, page, setSearchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "shops",
      {
        type,
        localisation,
        page,
        limit,
        search,
        userId: user?.id,
      },
    ],
    queryFn: fetchShops,
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  if (isLoading)
    return (
      <>
        <div className="sticky top-0 z-20">
          <NavBar />
          <CategoriesTabs
            type={type}
            navbarElement={navbarElement}
            setType={setType}
            setNavbarElement={setNavbarElement}
            setLocalisation={setLocalisation}
          />
        </div>
        <LocalisationFilter
          localisation={localisation}
          setLocalisation={setLocalisation}
          search={search}
          setSearch={handleSearchChange}
        />
        <div className="sm:mt-0 sm:mx-2">
          <ShopsHeader />
        </div>
        <ShopsHomeSkeleton />
      </>
    );
  if (isError)
    return (
      <>
        <div className="sticky top-0 z-20">
          <NavBar />
          <CategoriesTabs
            type={type}
            navbarElement={navbarElement}
            setType={setType}
            setNavbarElement={setNavbarElement}
            setLocalisation={setLocalisation}
          />
        </div>
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-red-500 text-lg font-semibold">
            Oups ! Une erreur est survenue lors du chargement.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100"
          >
            Réessayer
          </button>
        </div>
      </>
    );
  return (
    <>
      {/* <div
        className="sticky top-0 z-20 bg-center bg-cover"
        style={{ backgroundImage: `url(${faza})` }}
      >
        <NavBar />
        <CategoriesTabs
          type={type}
          navbarElement={navbarElement}
          setType={setType}
          setNavbarElement={setNavbarElement}
          setLocalisation={setLocalisation}
        />
      </div> */}
      <div className="sticky top-0 z-20">
        {/* Image layer — fades out by the bottom of the tabs bar */}
        <div
          className="absolute top-0 left-0 right-0 h-4/5 bg-[center_40%] bg-cover pointer-events-none"
          style={{ backgroundImage: `url(${faza})` }}
        />

        {/* Foreground content sits above the image layer */}
        <div className="relative z-10">
          <NavBar />
          <CategoriesTabs
            type={type}
            navbarElement={navbarElement}
            setType={setType}
            setNavbarElement={setNavbarElement}
            setLocalisation={setLocalisation}
          />
        </div>
      </div>
      <LocalisationFilter
        localisation={localisation}
        setLocalisation={setLocalisation}
        search={search}
        setSearch={handleSearchChange}
      />
      <div className="sm:mt-0 sm:mx-2 ">
        <ShopsHeader />
        {data?.shops?.length > 0 ? (
          <div className="lg:grid-cols-2 md:grid-cols-2 grid grid-cols-1 sm:gap-x-6 sm:gap-y-6">
            {data?.shops?.map((shop) => (
              <HomeShop key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3 mx-2">
            <h2 className="text-2xl font-semibold mb-1 text-gray-700">
              Aucune vente disponible
            </h2>
            <p className="text-center max-w-lg text-gray-400">
              Il n'y a pas encore de boutiques avec ces caracteristiques.
              Explorez d'autres boutiques !
            </p>
          </div>
        )}
      </div>
      <div className="mt-6">
        <HomePagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => page > 1 && setPage(page - 1)}
          onNext={() => page < totalPages && setPage(page + 1)}
        />
      </div>
    </>
  );
};

export default HomeShops;
