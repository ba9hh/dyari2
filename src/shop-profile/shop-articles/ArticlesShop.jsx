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
      return;
    }

    const { error: rpcError } = await supabase.rpc("decrement_articles_count", {
      shop_id: shopId,
    });
    if (rpcError) {
      console.error(rpcError);
    }

    toast.success("Article deleted successfully");
  };

  if (isLoading) return <ArticlesSkeleton />;
  if (isError) return <div>Error loading articles</div>;

  return (
    <>
      {/* Add article button */}
      <div className="w-full sm:w-2/3 px-3 sm:px-0">
        <Button
          fullWidth
          component={Link}
          to="add-article"
          variant="outlined"
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
          Ajouter un article
        </Button>
      </div>

      {/* Articles grid */}
      <div className="w-full sm:w-2/3 bg-white/80 shadow-sm sm:rounded-md border border-gray-200 p-2 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          {articles?.articles?.map((article, index) => (
            <ArticleShop
              key={article.id}
              article={article}
              onClick={() => setSelectedArticleId(article)}
              onDelete={() => handleDeleteArticle(article.id)}
            />
          ))}
        </div>

        {selectedArticleId && (
          <ArticleShopDialog
            article={selectedArticleId}
            open={true}
            onClose={() => setSelectedArticleId(null)}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="w-full sm:w-2/3 bg-white sm:shadow-sm sm:rounded-md">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => page > 1 && setPage(page - 1)}
          onNext={() => page < totalPages && setPage(page + 1)}
        />
      </div>
    </>
  );
};

export default ArticlesShop;
