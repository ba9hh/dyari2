import { useState, useEffect } from "react";
import ArticleShop from "./ArticleShop";
import ArticleShopDialog from "../../../components/ArticleShopDialog";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import Button from "@mui/material/Button";
import ArticlesSkeleton from "../../../skeleton/shop-profile/ArticlesSkeleton";
import { fetchShopArticles } from "../../../services/articles/articlesList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../supabaseClient";
const ArticlesShop = ({ shopId }) => {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
  const handleDeleteArticle = async (id) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Error deleting article");
    } else {
      toast.success("Article deleted successfully");
    }
  };
  if (isLoading) {
    return <ArticlesSkeleton />;
  }
  if (isError) return <div>Error loading articles</div>;
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pt-4 pb-8">
      <div className="flex justify-end w-full px-8">
        <Button
          component={Link}
          to="add-article"
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
          }}
        >
          Add article
        </Button>
      </div>
      <div className="columns-2 sm:columns-2 md:columns-3 gap-x-2 gap-y-2 sm:px-8 mt-4">
        {articles?.articles?.map((article, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <ArticleShop
              article={article}
              onClick={() => setSelectedArticleId(article)}
              onDelete={() => handleDeleteArticle(article.id)}
            />
          </div>
        ))}
      </div>
      {selectedArticleId && (
        <ArticleShopDialog
          article={selectedArticleId}
          open={true}
          onClose={() => setSelectedArticleId(null)}
        />
      )}
      <Pagination
        currentPage={page}
        totalPages={page}
        onPrev={() => page > 1 && setPage(page - 1)}
        onNext={() => page < totalPages && setPage(page + 1)}
      />
    </div>
  );
};

export default ArticlesShop;
