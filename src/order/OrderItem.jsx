import { Controller } from "react-hook-form";
import { TextField, Typography } from "@mui/material";
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
}) => {
  return (
    <div className="mb-2">
      <Typography variant="subtitle2">Article {index + 1}</Typography>
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
                error={!!errors.items?.[index]?.quantity}
                helperText={errors.items?.[index]?.quantity?.message}
                sx={{ mt: 2 }}
              />
            )}
          />
          {/* Subtotal */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Sous-total:{" "}
            {(watchItems[index].price || 0) * (watchItems[index].quantity || 0)}{" "}
            dt
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
