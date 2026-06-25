import categories from "@/data/categories";

const CategoriesTabs = ({
  type,
  navbarElement,
  setType,
  setNavbarElement,
  setLocalisation,
}) => {
  return (
    <>
      {/* Desktop */}
      <div className="sm:flex w-full justify-center items-center gap-x-4 hidden bg-[linear-gradient(to_bottom,_transparent_50%,_#f9fafb_50%)]">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="flex bg-white rounded-full px-6 shadow-md items-center">
          {categories.map((category) => (
            <div
              key={category.link}
              className={`px-3 py-1 cursor-pointer ${
                navbarElement == category.link
                  ? "border-b-[3px] border-amber-400 text-base text-amber-700"
                  : "text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300"
              }`}
              onClick={() => {
                setNavbarElement(category.link);
                setType(category.link);
                setLocalisation("Toute la Tunisie");
              }}
            >
              {category.name}
            </div>
          ))}
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Mobile — pill row matching desktop rounded-full style */}
      <div className="flex sm:hidden items-center gap-x-2 overflow-x-auto scrollbar-hide px-4 py-2 bg-white border-b border-gray-100">
        {categories.map((category) => (
          <button
            key={category.link}
            onClick={() => {
              setNavbarElement(category.link);
              setType(category.link);
              setLocalisation("Toute la Tunisie");
            }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
              navbarElement === category.link
                ? "bg-amber-400 border-amber-400 text-white"
                : "bg-white border-gray-300 text-gray-600 hover:border-amber-300 hover:text-amber-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategoriesTabs;
