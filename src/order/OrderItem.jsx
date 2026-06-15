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
  isLoading,
  page,
  setPage,
  totalPages,
  onRemove,
  canRemove,
}) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center">
        <Typography variant="subtitle2">Article {index + 1}</Typography>
        {canRemove && (
          <IconButton
            onClick={() => onRemove(index)}
            size="small"
            sx={{ color: "#ef4444" }}
            aria-label="Supprimer l'article"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <hr className="my-2" />
      <OrderArticles
        shopData={shopData}
        selectArticle={selectArticle}
        loading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        index={index}
        selectedArticleId={watchItems?.[index]?.articleId}
      />

      <div className="flex gap-2 items-center w-full mt-0">
        <div className="w-full">
          {/* Quantity */}
          {(() => {
            const articleType = watchItems?.[index]?.type;
            const minQty = Number(watchItems?.[index]?.minQuantity);
            const maxQty = Number(watchItems?.[index]?.maxQuantity);
            return (
              <Controller
                name={`items.${index}.quantity`}
                control={control}
                rules={{
                  required: "La quantité est requise",
                  min: {
                    value: minQty || 1,
                    message: minQty
                      ? `La quantité minimale est ${minQty}`
                      : "La quantité doit être supérieure à 0",
                  },
                  ...(maxQty && {
                    max: {
                      value: maxQty,
                      message: `La quantité maximale est ${maxQty}`,
                    },
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    fullWidth
                    label={
                      minQty && maxQty
                        ? `Quantité (min: ${minQty} ${articleType} , max: ${maxQty} ${articleType})`
                        : "Quantité"
                    }
                    // InputLabelProps={{ shrink: true }}
                    {...field}
                    onWheel={(e) => e.target.blur()}
                    error={!!errors.items?.[index]?.quantity}
                    helperText={errors.items?.[index]?.quantity?.message}
                    sx={{
                      mt: 2,
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
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
            );
          })()}
          {/* Subtotal */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Sous-total:{" "}
            {(watchItems[index].price || 0) * (watchItems[index].quantity || 0)}{" "}
            dt
          </Typography>
          <hr className="mt-2" />
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
