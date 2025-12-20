import { useState, useEffect } from "react";
import ShopArticle from "./ShopArticle";
import SkeletonArticlesShop from "../skeleton/shop/SkeletonArticlesShop";
import ArticleShopDialog from "../components/dialog/ArticleShopDialog";
import Pagination from "../components/Pagination";
import { fetchShopArticles } from "../services/articles/articlesList";
import { useQuery } from "@tanstack/react-query";
const ShopArticles = ({ shopId }) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const LIMIT = 8;
  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["shopArticles", { shopId, page, limit: LIMIT }],
    queryFn: fetchShopArticles,
    keepPreviousData: true,
  });
  useEffect(() => {
    if (articles?.totalPages) {
      setTotalPages(articles.totalPages);
    }
  }, [articles]);
  const handleOpenDialog = (articleId) => {
    setSelectedArticle(articleId);
    setOpen(true);
  };

  // Close dialog and reset selection
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedArticle(null);
  };
  if (isLoading) return <SkeletonArticlesShop />;
  return (
    <div className="w-full sm:w-2/3 bg-white sm:shadow-md rounded-md py-3">
      <div className="columns-2 sm:columns-2 md:columns-3 gap-x-2 gap-y-2 sm:px-8 sm:mt-4 border">
        {articles?.articles?.map((article, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <ShopArticle
              article={article}
              onClick={() => handleOpenDialog(article)}
            />
          </div>
        ))}
      </div>

      {selectedArticle && (
        <ArticleShopDialog
          article={selectedArticle}
          open={open}
          onClose={handleCloseDialog}
        />
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={() => page > 1 && setPage(page - 1)}
        onNext={() => page < totalPages && setPage(page + 1)}
      />
    </div>
  );
};

export default ShopArticles;
