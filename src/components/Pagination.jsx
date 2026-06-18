import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  isOrder = false,
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center gap-2 w-full mt-0 ${
        isOrder ? "justify-end" : "justify-center"
      }`}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-200 text-amber-700 transition hover:bg-amber-50 hover:border-amber-300 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>

      <span className="text-xs font-medium text-gray-600 px-1 min-w-[3.5rem] text-center">
        <span className="text-amber-700 font-semibold">{currentPage}</span>
        {" / "}
        {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-200 text-amber-700 transition hover:bg-amber-50 hover:border-amber-300 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
