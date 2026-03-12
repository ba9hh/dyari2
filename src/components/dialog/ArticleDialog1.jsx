import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
} from "@mui/material";
import Pagination from "../Pagination";
const ArticleDialog = ({
  shopData,
  selectImage,
  loading,
  page,
  setPage,
  totalPages,
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
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {shopData?.map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  selectImage(
                    item.article_image,
                    item.article_type,
                    item.article_price,
                    item.id,
                  )
                }
                className="mb-2 cursor-pointer"
              >
                <img
                  src={item.article_image}
                  alt="article"
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDialog;
