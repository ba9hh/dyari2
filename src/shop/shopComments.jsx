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

// ── Main component ────────────────────────────────────────────────────────────
const ShopCommentaires = ({ shopId }) => {
  const [page, setPage] = useState(1);

  const { average_rating, total_rating, totalPages, comments } = FAKE_DATA;

  // Paginate locally against the fake array
  const start = (page - 1) * LIMIT;
  const pageComments = comments.slice(start, start + LIMIT);

  return (
    <>
      {/* Rating summary bar */}
      <div className="w-full sm:w-2/3 bg-white border rounded-md px-4 py-3 shadow-sm flex items-center gap-3">
        <span className="text-2xl font-bold text-amber-600">
          {Number(average_rating).toFixed(1)}
        </span>
        <div>
          <ReactStars
            count={5}
            value={average_rating}
            size={20}
            isHalf={true}
            edit={false}
            activeColor="#d97706"
          />
          <p className="text-xs text-gray-400 mt-0.5">{total_rating} avis</p>
        </div>
      </div>

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
