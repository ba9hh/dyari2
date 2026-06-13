import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import Button from "@mui/material/Button";
import Pagination from "@/components/Pagination";
import { useQuery } from "@tanstack/react-query";
import { fetchShopCommentaires } from "@/services/shops/ShopCommentaires";
import SkeletonCommentaires from "@/skeleton/shop/SkeletonCommentaires";

// ── Skeleton fallback (inline, lightweight) ──────────────────────────────────
const DefaultSkeleton = () => (
  <div className="w-full sm:w-2/3 space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white border rounded-md p-4 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    ))}
  </div>
);

// ── Single comment card ───────────────────────────────────────────────────────
const CommentCard = ({ comment }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 160;
  const isLong = comment.comment_text?.length > MAX_CHARS;
  const displayText =
    isLong && !expanded
      ? comment.comment_text.slice(0, MAX_CHARS) + "…"
      : comment.comment_text;

  const initials = comment.user_name
    ? comment.user_name
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
    <div className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {comment.user_picture ? (
            <img
              src={comment.user_picture}
              alt={comment.user_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-100 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-amber-700">
                {initials}
              </span>
            </div>
          )}

          {/* Name + date */}
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {comment.user_name || "Utilisateur"}
            </p>
            {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
          </div>
        </div>

        {/* Stars */}
        {comment.rating != null && (
          <div className="flex-shrink-0 mt-0.5">
            <ReactStars
              count={5}
              value={comment.rating}
              size={16}
              isHalf={true}
              edit={false}
              activeColor="#d97706"
            />
          </div>
        )}
      </div>

      {/* Body */}
      {comment.comment_text && (
        <div className="mt-3">
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

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="w-full sm:w-2/3 bg-white border rounded-md p-10 flex flex-col items-center gap-3 text-center shadow-sm">
    <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center">
      <svg
        className="w-7 h-7 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </div>
    <p className="text-sm font-semibold text-gray-700">
      Aucun commentaire pour l'instant
    </p>
    <p className="text-xs text-gray-400 max-w-xs">
      Les clients qui ont effectué un achat peuvent laisser un avis. Soyez le
      premier !
    </p>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ShopCommentaires = ({ shopId }) => {
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["shopCommentaires", { shopId, page, limit: LIMIT }],
    queryFn: fetchShopCommentaires,
    keepPreviousData: true,
  });

  const comments = data?.comments ?? [];
  const totalPages = data?.totalPages ?? 1;

  // ── Summary bar ─────────────────────────────────────────────────────────────
  const avgRating = data?.average_rating;
  const totalRatings = data?.total_rating;

  if (isLoading) {
    try {
      return <SkeletonCommentaires />;
    } catch {
      return <DefaultSkeleton />;
    }
  }

  if (isError) {
    return (
      <div className="w-full sm:w-2/3 bg-white border rounded-md p-6 text-center shadow-sm">
        <p className="text-sm text-red-500">
          Impossible de charger les commentaires. Veuillez réessayer.
        </p>
      </div>
    );
  }

  if (!isLoading && comments.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Rating summary */}
      {avgRating != null && (
        <div className="w-full sm:w-2/3 bg-white border rounded-md px-4 py-3 shadow-sm flex items-center gap-3">
          <span className="text-2xl font-bold text-amber-600">
            {Number(avgRating).toFixed(1)}
          </span>
          <div>
            <ReactStars
              count={5}
              value={avgRating}
              size={20}
              isHalf={true}
              edit={false}
              activeColor="#d97706"
            />
            <p className="text-xs text-gray-400 mt-0.5">{totalRatings} avis</p>
          </div>
        </div>
      )}

      {/* Comment list */}
      <div className="w-full sm:w-2/3 space-y-3">
        {comments.map((comment, index) => (
          <CommentCard key={comment.id ?? index} comment={comment} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full sm:w-2/3 bg-white shadow-sm rounded-md">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={() => page > 1 && setPage(page - 1)}
            onNext={() => page < totalPages && setPage(page + 1)}
          />
        </div>
      )}
    </>
  );
};

export default ShopCommentaires;
