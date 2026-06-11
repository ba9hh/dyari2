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
          <Controller
            name={`items.${index}.quantity`}
            control={control}
            rules={{ min: { value: 1, message: "Quantity must be > 0" } }}
            render={({ field }) => (
              <TextField
                type="number"
                fullWidth
                label="Quantité"
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
