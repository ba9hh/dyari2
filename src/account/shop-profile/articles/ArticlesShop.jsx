import { useState, useEffect } from "react";
import ArticleShop from "./ArticleShop";
import ArticleShopDialog from "@/components/dialog/ArticleShopDialog";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import Button from "@mui/material/Button";
import ArticlesSkeleton from "@/skeleton/shop-profile/ArticlesSkeleton";
import { fetchShopArticles } from "@/services/articles/articlesList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";
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
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pt-4 pb-8 sm:border sm:border-t-2">
      <div className="flex justify-end w-full px-8">
        <Button
          fullWidth
          component={Link}
          to="add-article"
          variant="outlined"
          color="primary"
          // size="small"
          sx={{
            textTransform: "none",
            color: "#d97706",
            borderColor: "#d97706",
            "&:hover": {
              borderColor: "#b45309",
              backgroundColor: "rgba(217, 119, 6, 0.04)",
            },
          }}
        >
          Add article
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-2 sm:px-8 my-4">
        {articles?.articles?.map((article, index) => (
          <div key={index} className="mb-2">
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
