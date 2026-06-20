import { useEffect, useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, CircularProgress, MobileStepper } from "@mui/material";
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
import dyari from "@/assets/dyari.svg";
import OrderBreadCrumbs from "./OrderBreadCrumbs";

const Order = () => {
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [step, setStep] = useState(0);
  const LIMIT = 3;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { control, handleSubmit, watch, setValue, reset, trigger, formState: { errors } } = useForm({
    defaultValues: {
      userPhoneNumber: "",
      items: [{ articleId: "", type: "", quantity: null, price: 0, image: "", minQuantity: null, maxQuantity: null }],
      date: null,
      deliveryType: "sur_place",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchItems = watch("items");

  const { data: shopData, isLoading } = useQuery({
    queryKey: ["shopArticles", { shopId: state, page, limit: LIMIT }],
    queryFn: fetchShopArticles,
    enabled: !!state,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (shopData?.totalPages) setTotalPages(shopData.totalPages);
  }, [shopData]);

  const handleClose = () => setIsConnected(false);

  const selectArticle = (image, type, price, articleId, index, minQuantity, maxQuantity) => {
    setValue(`items.${index}.image`, image);
    setValue(`items.${index}.type`, type);
    setValue(`items.${index}.price`, price);
    setValue(`items.${index}.articleId`, articleId);
    setValue(`items.${index}.minQuantity`, minQuantity);
    setValue(`items.${index}.maxQuantity`, maxQuantity);
  };

  const handleNext = async () => {
    const quantityFields = watchItems.map((_, index) => `items.${index}.quantity`);
    const isValid = await trigger(quantityFields);
    const allValid = watchItems.every((item) => {
      if (!item.articleId || !item.quantity || item.quantity <= 0) return false;
      const min = item.minQuantity ?? 1;
      const max = item.maxQuantity;
      if (item.quantity < min) return false;
      if (max != null && item.quantity > max) return false;
      return true;
    });
    if (!isValid || !allValid) {
      toast.error("Veuillez sélectionner un article et une quantité valide pour chaque ligne.");
      return;
    }
    setStep(1);
  };

  const onSubmit = async (data) => {
    if (!user || user?.role === "shop") { setIsConnected(true); return; }
    if (!data.date) { toast.error("Veuillez sélectionner une date."); return; }
    setLoading(true);
    try {
      await createOrder({
        shopId: state,
        userId: user.id,
        phoneNumber: data.userPhoneNumber,
        neededDate: data.date,
        items: data.items,
        deliveryType: data.deliveryType,
      });
      toast.success("Commande ajoutée avec succès !");
      reset();
      setStep(0);
    } catch (err) {
      console.error("Error adding order:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = watchItems.reduce((sum, itm) => sum + (itm.price || 0) * (itm.quantity || 0), 0);

  return (
    <div className="flex justify-center w-full min-h-screen bg-white sm:bg-gray-100/50 pt-14 sm:pt-16 pb-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-fit sm:max-w-[600px] bg-white px-3 sm:px-6 sm:py-6 sm:my-4 sm:rounded-lg sm:border sm:shadow-md"
      >
        <OrderBreadCrumbs />

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Procédez à votre commande
          </h2>
          <img src={dyari} className="w-6 sm:w-7" />
        </div>
        <hr className="mb-3" />

        {/* Step 0: articles */}
        {step === 0 && (
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
                onRemove={remove}
                canRemove={fields.length > 1}
              />
            ))}

            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() =>
                append({ articleId: "", type: "", price: 0, image: "", quantity: null })
              }
              sx={{
                mt: 1,
                mb: 2,
                textTransform: "none",
                color: "#d97706",
                borderColor: "#d97706",
                "&:hover": {
                  borderColor: "#b45309",
                  backgroundColor: "rgba(217, 119, 6, 0.04)",
                },
              }}
            >
              + Ajouter un autre article
            </Button>

            {/* Running total */}
            {total > 0 && (
              <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3">
                <span className="text-sm text-gray-600">Total estimé</span>
                <span className="text-sm font-bold text-amber-700">{total} dt</span>
              </div>
            )}
          </div>
        )}

        {/* Step 1: summary */}
        {step === 1 && (
          <OrderSummary
            control={control}
            errors={errors}
            watchItems={watchItems}
            today={today}
          />
        )}

        {/* Stepper dots */}
        <div className="flex justify-center my-2">
          <MobileStepper
            variant="dots"
            steps={2}
            position="static"
            activeStep={step}
            sx={{
              background: "transparent",
              "& .MuiMobileStepper-dot": { backgroundColor: "#e5e7eb" },
              "& .MuiMobileStepper-dotActive": { backgroundColor: "#d97706" },
            }}
          />
        </div>

        {/* Action buttons */}
        {step === 0 && (
          <Button
            type="button"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              textTransform: "none",
              backgroundColor: "#d97706",
              "&:hover": { backgroundColor: "#b45309" },
            }}
            onClick={handleNext}
          >
            Suivant →
          </Button>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2 mt-2">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                textTransform: "none",
                backgroundColor: "#d97706",
                "&:hover": { backgroundColor: "#b45309" },
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Passer la commande"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              disabled={loading}
              fullWidth
              onClick={() => setStep(0)}
              sx={{
                textTransform: "none",
                color: "#d97706",
                borderColor: "#d97706",
                "&:hover": {
                  borderColor: "#b45309",
                  backgroundColor: "rgba(217, 119, 6, 0.04)",
                },
              }}
            >
              ← Retour
            </Button>
          </div>
        )}
      </form>

      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="Vous devez être connecté pour effectuer cette action."
      />
    </div>
  );
};

export default Order;
