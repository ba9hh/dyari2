import { useState, useEffect, useContext } from "react";
import ReactStars from "react-rating-stars-component";
import { supabase } from "@/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/AuthProvider";
import LoginRequiredDialog from "@/components/dialog/LoginRequiredDialog";

const LIMIT = 5;

const fetchReviews = async ({ shopId, page }) => {
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;
  const { data, error, count } = await supabase
    .from("reviews")
    .select("*, users(full_name, avatar_url)", { count: "exact" })
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error("Impossible de charger les avis.");
  return { reviews: data || [], totalCount: count || 0 };
};

const fetchShopStats = async (shopId) => {
  const { data, error } = await supabase
    .from("shops")
    .select("average_rating, total_rating")
    .eq("id", shopId)
    .single();
  if (error) throw error;
  return data;
};

const fetchExistingReview = async (shopId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, comment_text")
    .eq("shop_id", shopId)
    .eq("user_id", user.id)
    .maybeSingle();
  return data || null;
};

const fetchDeliveredOrder = async (shopId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("shop_id", shopId)
    .eq("user_id", user.id)
    .eq("order_state", "delivered")
    .limit(1)
    .maybeSingle();
  return !!data;
};

// ── Comment card ──────────────────────────────────────────────────────────────
const CommentCard = ({ comment }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 160;
  const isLong = comment.comment_text?.length > MAX_CHARS;
  const displayText =
    isLong && !expanded
      ? comment.comment_text.slice(0, MAX_CHARS) + "…"
      : comment.comment_text;

  const initials = comment.users?.full_name
    ? comment.users.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const date = comment.created_at
    ? new Date(comment.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {comment.users?.avatar_url ? (
            <img
              src={comment.users.avatar_url}
              alt={comment.users.full_name}
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-100 flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-amber-700">
                {initials}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
              {comment.users?.full_name || "Utilisateur"}
            </p>
            {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
          </div>
        </div>
        {comment.rating != null && (
          <div className="flex-shrink-0">
            <ReactStars
              count={5}
              value={comment.rating ?? 0}
              size={14}
              isHalf={true}
              edit={false}
              activeColor="#d97706"
            />
          </div>
        )}
      </div>
      {comment.comment_text && (
        <div className="mt-2.5">
          <p className="text-sm text-gray-600 leading-relaxed">{displayText}</p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors"
            >
              {expanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ── Pagination ─────────────────────────────────────────────────────────────────
const LocalPagination = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-center gap-3 py-3 px-4">
    <button
      onClick={onPrev}
      disabled={currentPage <= 1}
      className="text-xs sm:text-sm px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      ← Précédent
    </button>
    <span className="text-xs sm:text-sm text-gray-500">
      {currentPage} / {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage >= totalPages}
      className="text-xs sm:text-sm px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      Suivant →
    </button>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const ShopCommentaires = ({ shopId }) => {
  const { user } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: reviewsData,
    isLoading: fetchLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["reviews", shopId, page],
    queryFn: () => fetchReviews({ shopId, page }),
    // FIX: avoid refetch jitter on tab focus
    staleTime: 30_000,
  });

  const { data: shopStats } = useQuery({
    queryKey: ["shopStats", shopId],
    queryFn: () => fetchShopStats(shopId),
    staleTime: 30_000,
  });

  const reviews = reviewsData?.reviews || [];
  const totalCount = reviewsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <>
      <div className="w-full px-3 sm:px-0 flex flex-col sm:flex-row gap-3">
        {/* Left: stats + review list */}
        <div className="w-full sm:w-1/2 flex flex-col gap-3">
          {/* Rating summary */}
          <div className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 shadow-sm flex items-center gap-3">
            <span className="text-2xl font-bold text-amber-600">
              {Number(shopStats?.average_rating || 0).toFixed(1)}
            </span>
            <div>
              <ReactStars
                key={shopStats?.average_rating}
                count={5}
                value={Number(shopStats?.average_rating) || 0}
                size={18}
                isHalf={true}
                edit={false}
                activeColor="#d97706"
              />
              <p className="text-xs text-gray-400 mt-0.5">
                {shopStats?.total_rating} avis
              </p>
            </div>
          </div>

          {/* Review list */}
          {fetchLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-md p-4 shadow-sm animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-2.5 w-16 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-full bg-gray-100 rounded" />
                    <div className="h-2.5 w-4/5 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : fetchError ? (
            <div className="bg-red-50 border border-red-100 rounded-md p-4 text-sm text-red-500">
              Impossible de charger les avis.
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border rounded-md p-6 text-center text-sm text-gray-400">
              Aucun avis pour le moment. Soyez le premier !
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <CommentCard key={review.id} comment={review} />
              ))}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="w-full sm:w-2/3 bg-white shadow-sm rounded-md border border-gray-200 mx-3 sm:mx-0">
          <LocalPagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={() => page > 1 && setPage((p) => p - 1)}
            onNext={() => page < totalPages && setPage((p) => p + 1)}
          />
        </div>
      )}

      <LoginRequiredDialog
        open={isConnected}
        onClose={() => setIsConnected(false)}
        message="Vous devez être connecté pour effectuer cette action."
      />
    </>
  );
};

export default ShopCommentaires;
