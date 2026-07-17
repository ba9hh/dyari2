import { useState, useEffect } from "react";
import ArticleShop from "./ArticleShop";
import ArticleShopDialog from "@/components/dialog/ArticleShopDialog";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import Button from "@mui/material/Button";
import ArticlesSkeleton from "@/skeleton/shop-profile/ArticlesSkeleton";
import { fetchShopArticles } from "@/services/articles/articlesList";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";

const ArticlesShop = ({ shopId }) => {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 8;
  const queryClient = useQueryClient();

  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["shopArticles", { shopId, page, limit: LIMIT }],
    queryFn: fetchShopArticles,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (articles?.totalPages) setTotalPages(articles.totalPages);
  }, [articles]);

  const handleDeleteArticle = async (id) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
      return;
    }
    const { error: rpcError } = await supabase.rpc("decrement_articles_count", {
      shop_id: shopId,
    });
    if (rpcError) console.error(rpcError);
    toast.success("Article supprimé avec succès");
    queryClient.invalidateQueries({ queryKey: ["shopArticles"] });
  };

  const handleTogglePin = async (article) => {
    const nextPinned = !article.is_pinned;
    const { error } = await supabase
      .from("articles")
      .update({ is_pinned: nextPinned })
      .eq("id", article.id);

    if (error) {
      if (error.message?.includes("PIN_LIMIT_REACHED")) {
        toast.error("Vous ne pouvez épingler que 3 articles maximum");
      } else {
        console.error(error);
        toast.error("Erreur lors de la mise à jour");
      }
      return;
    }

    toast.success(nextPinned ? "Article épinglé" : "Article désépinglé");
    queryClient.invalidateQueries({ queryKey: ["shopArticles"] });
    queryClient.invalidateQueries({ queryKey: ["shops"] }); // keep home in sync
  };

  if (isLoading) return <ArticlesSkeleton />;
  if (isError) return <div>Erreur de chargement des articles</div>;

  return (
    <>
      <div className="w-full sm:w-2/3 px-3 sm:px-0">
        <Button
          fullWidth
          component={Link}
          to="ajouter-article"
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

      <div className="w-full sm:w-2/3 bg-white/80 shadow-sm sm:rounded-md border border-gray-200 p-2 sm:p-4">
        {articles?.articles?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {articles?.articles?.map((article) => (
              <ArticleShop
                key={article.id}
                article={article}
                onClick={() => setSelectedArticleId(article)}
                onDelete={() => handleDeleteArticle(article.id)}
                onTogglePin={() => handleTogglePin(article)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-gray-500">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">
              Aucun article pour le moment
            </h2>
            <p className="text-sm text-center max-w-md text-gray-400">
              Vous n'avez encore ajouté aucun article. Ajoutez votre premier
              article pour qu'il apparaisse ici et soit visible par vos clients.
            </p>
          </div>
        )}

        {selectedArticleId && (
          <ArticleShopDialog
            article={selectedArticleId}
            open={true}
            onClose={() => setSelectedArticleId(null)}
          />
        )}
      </div>

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
