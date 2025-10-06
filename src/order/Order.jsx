import { useEffect, useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, CircularProgress } from "@mui/material";
import { AuthContext } from "../AuthProvider";
import { toast } from "react-toastify";
import DyariLogo from "../components/DyariLogo";
import LoginRequiredDialog from "../components/LoginRequiredDialog";
import "react-datepicker/dist/react-datepicker.css";
import { fetchShopArticles } from "../services/articles/articlesList";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import ArticleDialog from "./ArticleDialog";
import { createOrder } from "../services/orders/createOrder";
const Order = () => {
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 8;
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
  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });
  if (errors?.date) {
    setValue("date", "");
  }
  const watchItems = watch("items");
  const {
    data: shopData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["shopArticles", { shopId: state, page, limit: LIMIT }],
    queryFn: fetchShopArticles,
    enabled: !!state,
    keepPreviousData: true,
  });
  useEffect(() => {
    if (shopData?.totalPages) {
      setTotalPages(shopData.totalPages);
    }
  }, [shopData]);
  const handleClose = () => {
    setIsConnected(false);
  };
  const handleOpenDialog = (index) => setOpenDialog({ open: true, index });
  const handleCloseDialog = () => setOpenDialog({ open: false, index: null });

  const selectImage = (image, type, price, articleId) => {
    setValue(`items.${openDialog.index}.image`, image);
    setValue(`items.${openDialog.index}.type`, type);
    setValue(`items.${openDialog.index}.price`, price);
    setValue(`items.${openDialog.index}.articleId`, articleId);
    handleCloseDialog();
  };

  const onSubmit = async (data) => {
    if (!user || user?.role == "shop") {
      setIsConnected(true);
      return;
    }
    const allValid = data.items.every(
      (item) => item.articleId && item.quantity > 0
    );
    if (!allValid) {
      toast.error("Some items are missing required information.");
      return;
    }
    if (!data.date) {
      toast.error("Please select a date.");
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        shopId: state,
        userId: user.id,
        phoneNumber: data.userPhoneNumber,
        neededDate: data.date,
        items: data.items,
      });
      toast.success("Order added successfully!");
      reset();
    } catch (err) {
      console.error("Error adding order:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center w-full min-h-screen bg-white sm:bg-[#f2f2f2] pt-16 pb-8 sm:px-0 px-2">
      <DyariLogo />
      <form
        onSubmit={handleSubmit(onSubmit)}
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
          onClick={() =>
            append({ type: "", price: 0, image: "", quantity: null })
          }
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

      <ArticleDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        shopData={shopData?.articles}
        selectImage={selectImage}
        loading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in as a user to pass an order"
      />
    </div>
  );
};

export default Order;
