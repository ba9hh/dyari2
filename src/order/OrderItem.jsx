import { Controller } from "react-hook-form";
import { TextField, Typography, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OrderArticles from "./OrderArticles";

const OrderItem = ({
  index,
  control,
  errors,
  watchItems,
  shopData,
  selectArticle,
  loading,
  page,
  setPage,
  totalPages,
  onRemove,
  canRemove,
}) => {
  const articleType = watchItems?.[index]?.type;
  const minQty = Number(watchItems?.[index]?.minQuantity);
  const maxQty = Number(watchItems?.[index]?.maxQuantity);
  const subtotal =
    (watchItems?.[index]?.price || 0) * (watchItems?.[index]?.quantity || 0);

  return (
    <div className="mb-3 bg-gray-50/60 rounded-md border border-gray-200 p-3 sm:p-4">
      {/* Header row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Article {index + 1}
        </span>
        {canRemove && (
          <IconButton
            onClick={() => onRemove(index)}
            size="small"
            sx={{ color: "#ef4444", p: 0.5 }}
            aria-label="Supprimer l'article"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      <OrderArticles
        shopData={shopData}
        selectArticle={selectArticle}
        loading={loading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        index={index}
        selectedArticleId={watchItems?.[index]?.articleId}
      />

      {/* Quantity + subtotal */}
      <Controller
        name={`items.${index}.quantity`}
        control={control}
        rules={{
          required: "La quantité est requise",
          min: {
            value: minQty || 1,
            message: minQty
              ? `Quantité minimale : ${minQty}`
              : "La quantité doit être supérieure à 0",
          },
          ...(maxQty && {
            max: {
              value: maxQty,
              message: `Quantité maximale : ${maxQty}`,
            },
          }),
          validate: () =>
            !!watchItems[index]?.articleId || "Sélectionnez d'abord un article",
        }}
        render={({ field }) => (
          <TextField
            type="number"
            fullWidth
            size="small"
            label={
              minQty && maxQty
                ? `Quantité (min: ${minQty} ${articleType}, max: ${maxQty} ${articleType})`
                : "Quantité"
            }
            {...field}
            onWheel={(e) => e.target.blur()}
            error={!!errors.items?.[index]?.quantity}
            helperText={errors.items?.[index]?.quantity?.message}
            sx={{
              mt: 1,
              "& input[type=number]": { MozAppearance: "textfield" },
              "& input[type=number]::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& label.Mui-focused": { color: "#d97706" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#d97706" },
              },
            }}
          />
        )}
      />

      {subtotal > 0 && (
        <div className="mt-2 text-right">
          <span className="text-xs text-gray-500">Sous-total: </span>
          <span className="text-sm font-semibold text-amber-700">
            {subtotal} dt
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
