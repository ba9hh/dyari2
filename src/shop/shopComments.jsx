import { useState } from "react";
import ReactStars from "react-rating-stars-component";

// ── Fake data ─────────────────────────────────────────────────────────────────
const FAKE_DATA = {
  average_rating: 4.3,
  total_rating: 12,
  totalPages: 3,
  comments: [
    {
      id: 1,
      user_name: "Sarra Ben Ali",
      user_picture: null,
      rating: 5,
      comment_text:
        "Excellent service, les articles sont exactement comme sur les photos. Livraison rapide et emballage soigné. Je recommande vivement cette boutique !",
      created_at: "2025-05-20T10:30:00Z",
    },
    {
      id: 2,
      user_name: "Mohamed Trabelsi",
      user_picture: null,
      rating: 4,
      comment_text:
        "Très bonne qualité, le vendeur est réactif et agréable. J'ai eu un petit souci avec ma commande mais il a été réglé rapidement.",
      created_at: "2025-05-15T08:00:00Z",
    },
    {
      id: 3,
      user_name: "Amira Khelil",
      user_picture: null,
      rating: 4.5,
      comment_text:
        "Produits de qualité, je suis très satisfaite de mon achat. Le tissu est doux et la coupe est parfaite. J'ai déjà recommandé cette boutique à mes amies et je reviendrai certainement pour mes prochains achats.",
      created_at: "2025-04-30T14:20:00Z",
    },
    {
      id: 4,
      user_name: "Youssef Hamdi",
      user_picture: null,
      rating: 3.5,
      comment_text:
        "Correct, sans plus. Le délai de livraison était un peu long mais la qualité est au rendez-vous.",
      created_at: "2025-04-18T09:45:00Z",
    },
    {
      id: 5,
      user_name: "Nour Mansouri",
      user_picture: null,
      rating: 5,
      comment_text: "Parfait ! Rien à redire, tout était impeccable.",
      created_at: "2025-04-10T16:00:00Z",
    },
  ],
};

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
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {comment.user_name || "Utilisateur"}
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

// ── Pagination (inline, no import needed) ────────────────────────────────────
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
const AddCommentForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    if (text.trim().length < 10) {
      setError("Votre commentaire doit contenir au moins 10 caractères.");
      return;
    }
    setError("");
    onSubmit({ rating, text });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full sm:w-2/3 bg-white border rounded-md p-6 shadow-sm flex flex-col items-center gap-2 text-center">
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
    <div className="w-full sm:w-2/3 bg-white border rounded-md p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        Laisser un commentaire{" "}
        <span className="text-sm font-normal text-gray-600">
          (Vous ne pouvez laisser un avis que si vous avez effectué un achat.)
        </span>
      </h2>

      {/* Star picker */}
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

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        placeholder="Partagez votre expérience avec cette boutique…"
        rows={3}
        className="w-full text-sm text-gray-700 border border-gray-200 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 placeholder-gray-300 transition"
      />

      {/* Char count + error */}
      <div className="flex items-center justify-between mt-1 mb-3">
        {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
        <span className="text-xs text-gray-300 ml-auto">
          {text.length} / 300
        </span>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-md text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-colors"
      >
        Publier mon avis
      </button>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ShopCommentaires = ({ shopId }) => {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState(FAKE_DATA.comments);
  const [averageRating, setAverageRating] = useState(FAKE_DATA.average_rating);
  const [totalRating, setTotalRating] = useState(FAKE_DATA.total_rating);

  const totalPages = Math.ceil(comments.length / LIMIT);
  const start = (page - 1) * LIMIT;
  const pageComments = comments.slice(start, start + LIMIT);

  const handleNewComment = ({ rating, text }) => {
    const newComment = {
      id: Date.now(),
      user_name: "Vous",
      user_picture: null,
      rating,
      comment_text: text,
      created_at: new Date().toISOString(),
    };
    const updated = [newComment, ...comments];
    const newAvg =
      updated.reduce((sum, c) => sum + c.rating, 0) / updated.length;
    setComments(updated);
    setAverageRating(Math.round(newAvg * 10) / 10);
    setTotalRating((t) => t + 1);
    setPage(1);
  };

  return (
    <>
      {/* Rating summary bar */}
      <div className="w-full sm:w-2/3 bg-white border rounded-md px-4 py-3 shadow-sm flex items-center gap-3">
        <span className="text-2xl font-bold text-amber-600">
          {Number(averageRating).toFixed(1)}
        </span>
        <div>
          <ReactStars
            count={5}
            value={averageRating}
            size={20}
            isHalf={true}
            edit={false}
            activeColor="#d97706"
          />
          <p className="text-xs text-gray-400 mt-0.5">{totalRating} avis</p>
        </div>
      </div>

      {/* Add comment form */}
      <AddCommentForm onSubmit={handleNewComment} />

      {/* Comment list */}
      <div className="w-full sm:w-2/3 space-y-3">
        {pageComments.map((comment, index) => (
          <CommentCard key={comment.id ?? index} comment={comment} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full sm:w-2/3 bg-white shadow-sm rounded-md border">
          <LocalPagination
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
