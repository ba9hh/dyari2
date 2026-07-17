import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { Trash2, Pencil, Pin, PinOff } from "lucide-react";
import { Link } from "react-router-dom";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const ArticleShop = ({ article, onClick, onDelete, onTogglePin }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };
  const handleConfirmDelete = () => {
    onDelete();
    setOpenDialog(false);
    setSnackbarOpen(true);
  };
  const handleCancel = () => setOpenDialog(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  const handlePinClick = (e) => {
    e.stopPropagation();
    onTogglePin();
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={onClick}>
        <img
          className={`w-full object-cover aspect-square rounded-md sm:rounded-lg border ${
            article.is_pinned ? "border-amber-400 border-2" : "border-gray-100"
          }`}
          src={article.article_image}
          alt={article.article_title}
        />

        {article.is_pinned && (
          <div className="absolute top-1 left-1 bg-amber-500 text-white rounded-full p-1 shadow">
            <Pin size={12} fill="white" />
          </div>
        )}

        <div
          className="absolute top-0 right-0 left-0 h-8 p-1 bg-white/95 border-b border-gray-100 rounded-t-md
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
        >
          <p className="text-center text-xs sm:text-sm font-medium text-gray-700 truncate">
            {article.article_price} dt / {article.article_type}
          </p>
        </div>

        <div
          className="absolute bottom-0 right-0 left-0 h-8 p-1 bg-white/95 border-t border-gray-100 rounded-b-md
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
        >
          <p className="text-center text-xs sm:text-sm font-medium text-gray-700 truncate">
            {article.article_title}
          </p>
        </div>

        <div className="flex gap-1.5 absolute top-9 left-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handlePinClick}
            aria-label={
              article.is_pinned ? "Désépingler" : "Épingler l'article"
            }
            className={`p-1.5 sm:p-1 text-white rounded-full shadow-lg transition-all duration-200 active:scale-95 hover:scale-110 touch-manipulation ${
              article.is_pinned
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {article.is_pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button
            onClick={handleDeleteClick}
            aria-label="Delete article"
            className="p-1.5 sm:p-1 bg-red-500 text-white rounded-full shadow-lg transition-all duration-200 hover:bg-red-600 active:scale-95 hover:scale-110 touch-manipulation"
          >
            <Trash2 size={14} />
          </button>
          <Link
            to={`modifier-article/${article.id}`}
            onClick={(e) => e.stopPropagation()}
            aria-label="Edit article"
            className="p-1.5 sm:p-1 bg-green-500 text-white rounded-full shadow-lg transition-all duration-200 hover:bg-green-600 active:scale-95 hover:scale-110 touch-manipulation"
          >
            <Pencil size={14} />
          </Link>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet article ?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Article supprimé avec succès
        </Alert>
      </Snackbar>
    </>
  );
};

export default ArticleShop;
