import { useState, useEffect, useCallback } from "react";
import ReactStars from "react-rating-stars-component";
import { supabase } from "@/supabaseClient";

const LIMIT = 5;

// ── Single comment card ───────────────────────────────────────────────────────
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
    <div className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {comment.users?.avatar_url ? (
            <img
              src={comment.users.avatar_url}
              alt={comment.users.full_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-100 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-amber-700">
                {initials}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {comment.users?.full_name || "Utilisateur"}
            </p>
            {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
          </div>
        </div>

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

// ── Pagination ────────────────────────────────────────────────────────────────
const LocalPagination = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-center gap-4 py-3 px-4">
    <button
      onClick={onPrev}
      disabled={currentPage <= 1}
      className="text-sm px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      ← Précédent
    </button>
    <span className="text-sm text-gray-500">
      Page {currentPage} / {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage >= totalPages}
      className="text-sm px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      Suivant →
    </button>
  </div>
);

// ── Add comment form ──────────────────────────────────────────────────────────
const AddCommentForm = ({ onSubmit, loading, existingReview }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // If the user already left a review, show it pre-filled (read-only)
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setText(existingReview.comment_text || "");
      setSubmitted(true);
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    setError("");
    const ok = await onSubmit({ rating, text });
    if (ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full bg-white border rounded-md p-6 shadow-sm flex flex-col items-center gap-2 text-center">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">
          Merci pour votre avis !
        </p>
        <p className="text-xs text-gray-400">
          Votre commentaire a été soumis avec succès.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border rounded-md p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        Laisser un avis{" "}
        <span className="text-sm font-normal text-gray-600">
          (Vous ne pouvez laisser un avis que si vous avez effectué un achat.)
        </span>
      </h2>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">Votre note :</span>
        <ReactStars
          count={5}
          value={rating}
          size={24}
          isHalf={false}
          edit={true}
          activeColor="#d97706"
          onChange={(val) => {
            setRating(val);
            setError("");
          }}
        />
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        placeholder="Partagez votre expérience avec cette boutique… (facultatif)"
        rows={3}
        maxLength={300}
        className="w-full text-sm text-gray-700 border border-gray-200 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 placeholder-gray-300 transition"
      />

      <div className="flex items-center justify-between mt-1 mb-3">
        {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
        <span className="text-xs text-gray-300 ml-auto">
          {text.length} / 300
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || loading}
        className="w-full py-2 rounded-md text-sm font-medium text-white transition-colors bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Publication…" : "Publier mon avis"}
      </button>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ShopCommentaires = ({ shopId }) => {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [shopStats, setShopStats] = useState({
    average_rating: 0,
    total_rating: 0,
  });
  const [existingReview, setExistingReview] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const totalPages = Math.ceil(totalCount / LIMIT);

  // ── Fetch reviews page ──────────────────────────────────────────────────────
  const fetchReviews = useCallback(
    async (pageNum) => {
      setFetchLoading(true);
      setFetchError(null);

      const from = (pageNum - 1) * LIMIT;
      const to = from + LIMIT - 1;

      const { data, error, count } = await supabase
        .from("reviews")
        .select("*, users(full_name, avatar_url)", { count: "exact" })
        .eq("shop_id", shopId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        setFetchError("Impossible de charger les avis.");
      } else {
        setReviews(data || []);
        setTotalCount(count || 0);
      }
      setFetchLoading(false);
    },
    [shopId],
  );

  // ── Fetch shop rating stats ─────────────────────────────────────────────────
  const fetchShopStats = useCallback(async () => {
    const { data, error } = await supabase
      .from("shops")
      .select("average_rating, total_rating")
      .eq("id", shopId)
      .single();

    if (!error && data) setShopStats(data);
  }, [shopId]);

  // ── Check if current user already reviewed this shop ───────────────────────
  const fetchExistingReview = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("reviews")
      .select("id, rating, comment_text")
      .eq("shop_id", shopId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) setExistingReview(data);
  }, [shopId]);

  useEffect(() => {
    fetchReviews(page);
  }, [fetchReviews, page]);

  useEffect(() => {
    fetchShopStats();
    fetchExistingReview();
  }, [fetchShopStats, fetchExistingReview]);

  // ── Submit new review ───────────────────────────────────────────────────────
  const handleNewComment = async ({ rating, text }) => {
    setSubmitLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      setSubmitLoading(false);
      return false;
    }

    const { error } = await supabase.from("reviews").insert({
      shop_id: shopId,
      user_id: user.id,
      rating,
      comment_text: text.trim() || null,
    });

    setSubmitLoading(false);

    if (error) {
      // If it's a unique violation (user already reviewed), surface it gracefully
      console.error("Review insert error:", error);
      return false;
    }

    // Refresh stats and first page
    await fetchShopStats();
    setPage(1);
    await fetchReviews(1);
    return true;
  };

  return (
    <>
      {/* Rating summary + comments + form */}
      <div className="w-full sm:w-2/3 flex gap-3">
        <div className="w-1/2">
          {/* Average rating bar */}
          <div className="w-full bg-white border rounded-md px-4 py-3 shadow-sm flex items-center gap-3 mb-3">
            <span className="text-2xl font-bold text-amber-600">
              {Number(shopStats.average_rating).toFixed(1)}
            </span>
            <div>
              <ReactStars
                count={5}
                value={Number(shopStats.average_rating)}
                size={20}
                isHalf={true}
                edit={false}
                activeColor="#d97706"
              />
              <p className="text-xs text-gray-400 mt-0.5">
                {shopStats.total_rating} avis
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
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
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
              {fetchError}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border rounded-md p-6 text-center text-sm text-gray-400">
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </div>
          ) : (
            <div className="w-full space-y-3">
              {reviews.map((review) => (
                <CommentCard key={review.id} comment={review} />
              ))}
            </div>
          )}
        </div>

        {/* Add comment form */}
        <div className="w-1/2">
          <AddCommentForm
            onSubmit={handleNewComment}
            loading={submitLoading}
            existingReview={existingReview}
          />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full sm:w-2/3 bg-white shadow-sm rounded-md border">
          <LocalPagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={() => page > 1 && setPage((p) => p - 1)}
            onNext={() => page < totalPages && setPage((p) => p + 1)}
          />
        </div>
      )}
    </>
  );
};

export default ShopCommentaires;
