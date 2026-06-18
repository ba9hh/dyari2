import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
} from "@mui/material";
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
    <div>
      <h1 className="text-center text-sm mb-2">Sélectionner un article</h1>
      <div>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {shopData?.map((item, idx) => (
                <div
                  key={idx}
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
                  className={`relative group mb-2 cursor-pointer ${selectedArticleId === item.id ? "border-4 border-amber-600" : ""}`}
                >
                  <img
                    src={item.article_image}
                    alt="article"
                    className={`w-full aspect-square object-cover rounded-md `}
                  />
                  <div className="absolute top-0 right-0 left-0 h-5 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-center text-xs font-medium text-gray-700">
                      {item.article_price} dt par {item.article_type}
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-0 left-0 h-5 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-center text-xs font-medium text-gray-700">
                      {item.article_title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex sm:hidden gap-1 overflow-x-auto scrollbar-hide">
              {shopData?.map((item, idx) => (
                <img
                  key={idx}
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
                  src={item.article_image}
                  alt="article"
                  className={`flex-shrink-0 w-36 aspect-square object-cover ${selectedArticleId === item.id ? "border-4 border-amber-600" : ""}`}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-2">
                <Pagination
                  page={page}
                  count={totalPages}
                  onChange={(event, value) => setPage(value)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderArticles;
