import { useForm, useFieldArray } from "react-hook-form";
import { Button, CircularProgress } from "@mui/material";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";

const OrderForm = ({ loading, onSubmit, handleOpenDialog }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userPhoneNumber: "",
      items: [{ articleId: "", type: "", quantity: null, price: 0, image: "" }],
      date: null,
    },
  });

  const { fields, append } = useFieldArray({ control, name: "items" });
  const watchItems = watch("items");

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, reset))}
      className="w-full max-w-[600px] bg-white p-6 rounded-lg border sm:border:0 sm:shadow-md"
    >
      {fields.map((field, index) => (
        <OrderItem
          key={field.id}
          index={index}
          control={control}
          errors={errors}
          watchItems={watchItems}
          handleOpenDialog={handleOpenDialog}
        />
      ))}

      <Button
        variant="outlined"
        fullWidth
        onClick={() => append({ type: "", price: 0, image: "", quantity: 0 })}
        sx={{ mb: 2 }}
      >
        Ajouter un autre article
      </Button>

      <OrderSummary
        control={control}
        errors={errors}
        watchItems={watchItems}
        today={today}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        color="primary"
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : "Passez votre commande"}
      </Button>
    </form>
  );
};

export default OrderForm;
