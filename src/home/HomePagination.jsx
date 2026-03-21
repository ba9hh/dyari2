import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function HomePagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  isOrder = false,
}) {
  return (
    <>
      {totalPages > 1 && (
        <div
          className={`relative flex flex-col gap-2 sm:gap-0 items-center sm:flex-row ${
            isOrder ? "sm:justify-between" : "sm:justify-center"
          } w-full mt-0 py-2`}
        >
          <div className={`sm:absolute ${isOrder ? "right-0" : "right-8"}`}>
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-gray-700 px-2 py-0.5">
                <div className="border rounded">{currentPage}</div>
                <span className="text-gray-500">of {totalPages}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={onPrev}
                  disabled={currentPage === 1}
                  className={`p-1 bg-gray-100 hover:bg-gray-300 border border-gray-700 transition ${
                    currentPage === 1
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-600"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={onNext}
                  disabled={currentPage === totalPages}
                  className={`p-1 bg-gray-100 hover:bg-gray-300 border border-gray-700 transition ${
                    currentPage === totalPages
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-800"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
