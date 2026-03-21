import { useEffect, useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, CircularProgress } from "@mui/material";
import { AuthContext } from "@/AuthProvider";
import { toast } from "react-toastify";
import LoginRequiredDialog from "@/components/dialog/LoginRequiredDialog";
import "react-datepicker/dist/react-datepicker.css";
import { fetchShopArticles } from "@/services/articles/articlesList";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import { createOrder } from "@/services/orders/createOrder";
import { Typography, MobileStepper, Breadcrumbs, Link } from "@mui/material";
import OrderBreadCrumbs from "./OrderBreadCrumbs";
const Order = () => {
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [step, setStep] = useState(0);
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
  const selectArticle = (image, type, price, articleId, index) => {
    setValue(`items.${index}.image`, image);
    setValue(`items.${index}.type`, type);
    setValue(`items.${index}.price`, price);
    setValue(`items.${index}.articleId`, articleId);
  };

  const onSubmit = async (data) => {
    if (!user || user?.role == "shop") {
      setIsConnected(true);
      return;
    }
    const allValid = data.items.every(
      (item) => item.articleId && item.quantity > 0,
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
    <div className="flex justify-center w-full min-h-screen bg-white sm:bg-[#f2f2f2] pt-16 pb-8 sm:px-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-fit sm:max-w-[600px] bg-white px-3 sm:p-6 sm:rounded-lg sm:border sm:border:0 sm:shadow-md"
      >
        <OrderBreadCrumbs />
        <hr className="mb-2" />
        {step == 0 && (
          <div>
            {fields.map((field, index) => (
              <OrderItem
                key={field.id}
                index={index}
                control={control}
                errors={errors}
                watchItems={watchItems}
                shopData={shopData?.articles}
                selectArticle={selectArticle}
                loading={isLoading}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            ))}

            <Button
              variant="outlined"
              fullWidth
              onClick={() =>
                append({ type: "", price: 0, image: "", quantity: null })
              }
              sx={{
                mb: 1,
                textTransform: "none",
                color: "#d97706",
                borderColor: "#d97706",
                "&:hover": {
                  borderColor: "#b45309",
                  backgroundColor: "rgba(217, 119, 6, 0.04)",
                },
              }}
            >
              Ajouter un autre article
            </Button>
            <Typography variant="body1" sx={{ width: "100%" }}>
              Total:{" "}
              {watchItems.reduce(
                (sum, itm) => sum + (itm.price || 0) * (itm.quantity || 0),
                0,
              )}{" "}
              dt
            </Typography>
          </div>
        )}
        {step == 1 && (
          <OrderSummary
            control={control}
            errors={errors}
            watchItems={watchItems}
            today={today}
          />
        )}
        <div className="flex justify-center mb-1">
          <MobileStepper
            variant="dots"
            steps={2}
            position="static"
            activeStep={step}
            sx={{
              "& .MuiMobileStepper-dot": {
                backgroundColor: "#e5e7eb",
              },
              "& .MuiMobileStepper-dotActive": {
                backgroundColor: "#d97706",
              },
            }}
          />
        </div>
        {step == 0 && (
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            color="primary"
            fullWidth
            sx={{
              textTransform: "none",
              backgroundColor: "#d97706",
              "&:hover": {
                backgroundColor: "#b45309",
              },
            }}
            onClick={() => setStep(1)}
          >
            {loading ? <CircularProgress size={24} /> : "Suivant"}
          </Button>
        )}
        {step == 1 && (
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            color="primary"
            fullWidth
            sx={{
              textTransform: "none",
              backgroundColor: "#d97706",
              "&:hover": {
                backgroundColor: "#b45309",
              },
            }}
            onClick={() => setStep(0)}
          >
            {loading ? <CircularProgress size={24} /> : "Passer la commande"}
          </Button>
        )}
      </form>

      {/* <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in as a user to pass an order"
      /> */}
    </div>
  );
};

export default Order;
