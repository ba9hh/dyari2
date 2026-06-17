import { useState, useCallback, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { supabase } from "@/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const LIMIT = 5;

// ── Fetch functions ───────────────────────────────────────────────────────────
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
              value={comment.rating ?? 0}
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
// ── Add comment form ──────────────────────────────────────────────────────────
const AddCommentForm = ({ onSubmit, onUpdate, loading, existingReview }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

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
    const ok = editing
      ? await onUpdate({ rating, text, id: existingReview.id })
      : await onSubmit({ rating, text });
    if (ok) {
      setSubmitted(true);
      setEditing(false);
    }
  };

  const handleEdit = () => {
    setRating(existingReview.rating);
    setText(existingReview.comment_text || "");
    setEditing(true);
    setSubmitted(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full bg-white border rounded-md p-6 shadow-sm flex flex-col items-center gap-3 text-center">
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
        <div className="flex justify-center">
          <ReactStars
            count={5}
            value={existingReview?.rating ?? 0}
            size={20}
            isHalf={true}
            edit={false}
            activeColor="#d97706"
          />
        </div>
        {existingReview?.comment_text && (
          <p className="text-xs text-gray-500 italic">
            "{existingReview.comment_text}"
          </p>
        )}
        <button
          onClick={handleEdit}
          className="mt-1 text-xs font-medium text-amber-600 border border-amber-300 rounded px-3 py-1 hover:bg-amber-50 transition-colors"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border rounded-md p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {editing ? "Modifier votre avis" : "Laisser un avis"}{" "}
        <span className="text-sm font-normal text-gray-600">
          (Vous ne pouvez laisser un avis que si vous avez effectué un achat.)
        </span>
      </h2>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">Votre note :</span>
        <ReactStars
          key={rating} // force remount when editing resets value
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

      <div className="flex gap-2">
        {editing && (
          <button
            onClick={handleCancel}
            className="w-1/3 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
          className={`py-2 rounded-md text-sm font-medium text-white transition-colors bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed ${editing ? "w-2/3" : "w-full"}`}
        >
          {loading
            ? "Publication…"
            : editing
              ? "Mettre à jour"
              : "Publier mon avis"}
        </button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ShopCommentaires = ({ shopId }) => {
  const [page, setPage] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: reviewsData,
    isLoading: fetchLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["reviews", shopId, page],
    queryFn: () => fetchReviews({ shopId, page }),
  });

  const { data: shopStats } = useQuery({
    queryKey: ["shopStats", shopId],
    queryFn: () => fetchShopStats(shopId),
  });

  const { data: existingReview } = useQuery({
    queryKey: ["existingReview", shopId],
    queryFn: () => fetchExistingReview(shopId),
  });

  const reviews = reviewsData?.reviews || [];
  const totalCount = reviewsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

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
      console.error("Review insert error:", error);
      return false;
    }

    // Invalidate all related queries to trigger a fresh fetch
    await queryClient.invalidateQueries({ queryKey: ["reviews", shopId] });
    await queryClient.invalidateQueries({ queryKey: ["shopStats", shopId] });
    await queryClient.invalidateQueries({ queryKey: ["shop", shopId] }); // refreshes ShopInfos too

    return true;
  };
  const handleUpdateComment = async ({ rating, text, id }) => {
    setSubmitLoading(true);

    const { error } = await supabase
      .from("reviews")
      .update({
        rating,
        comment_text: text.trim() || null,
      })
      .eq("id", id);

    setSubmitLoading(false);
    if (error) {
      console.error("Review update error:", error);
      return false;
    }

    await queryClient.invalidateQueries({ queryKey: ["reviews", shopId] });
    await queryClient.invalidateQueries({ queryKey: ["shopStats", shopId] });
    await queryClient.invalidateQueries({ queryKey: ["shop", shopId] });
    await queryClient.invalidateQueries({
      queryKey: ["existingReview", shopId],
    });

    return true;
  };

  return (
    <>
      <div className="w-full sm:w-2/3 flex gap-3">
        <div className="w-1/2">
          <div className="w-full bg-white border rounded-md px-4 py-3 shadow-sm flex items-center gap-3 mb-3">
            <span className="text-2xl font-bold text-amber-600">
              {Number(shopStats?.average_rating || 0).toFixed(1)}
            </span>
            <div>
              <ReactStars
                key={shopStats?.average_rating}
                count={5}
                value={Number(shopStats?.average_rating) || 0}
                size={20}
                isHalf={true}
                edit={false}
                activeColor="#d97706"
              />
              <p className="text-xs text-gray-400 mt-0.5">
                {shopStats?.total_rating} avis
              </p>
            </div>
          </div>

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
              Impossible de charger les avis.
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

        <div className="w-1/2">
          <AddCommentForm
            onSubmit={handleNewComment}
            onUpdate={handleUpdateComment}
            loading={submitLoading}
            existingReview={existingReview}
          />
        </div>
      </div>

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
