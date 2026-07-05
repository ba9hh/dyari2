import { CircularProgress, Box } from "@mui/material";
import Pagination from "@/components/Pagination";

const OrderArticles = ({
  shopData,
  selectArticle,
  loading,
  page,
  setPage,
  totalPages,
  index,
  selectedArticleId,
}) => {
  return (
    <div className="mb-3">
      <h1 className="text-center text-sm mb-2 text-gray-600">Sélectionner un article</h1>
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={28} sx={{ color: "#d97706" }} />
        </Box>
      ) : (
        <>
          {/* Unified grid — 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {shopData?.map((item) => {
              const isSelected = selectedArticleId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() =>
                    selectArticle(
                      item.article_image,
                      item.article_type,
                      item.article_price,
                      item.id,
                      index,
                      item.article_min_quantity,
                      item.article_max_quantity,
                    )
                  }
                  className={`relative group cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-150 ${
                    isSelected
                      ? "border-amber-500 shadow-md"
                      : "border-transparent hover:border-amber-300"
                  }`}
                >
                  <img
                    src={item.article_image}
                    alt={item.article_title}
                    className="w-full aspect-square object-cover"
                  />
                  {/* Price — always visible on mobile, hover on desktop */}
                  <div className="absolute top-0 left-0 right-0 bg-white/95 border-b border-gray-100 py-0.5 px-1
                    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-center text-xs font-medium text-gray-700 truncate">
                      {item.article_price} dt / {item.article_type}
                    </p>
                  </div>
                  {/* Title — always visible on mobile, hover on desktop */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 py-0.5 px-1
                    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-center text-xs font-medium text-gray-700 truncate">
                      {item.article_title}
                    </p>
                  </div>
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isOrder
          />
        </>
      )}
    </div>
  );
};

export default OrderArticles;
