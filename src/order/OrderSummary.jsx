import { Controller, useWatch } from "react-hook-form";
import {
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect } from "react";

const OrderSummary = ({
  control,
  errors,
  watchItems,
  today,
  canDeliver,
  setValue,
}) => {
  const deliveryType = useWatch({
    control,
    name: "deliveryType",
    defaultValue: "sur_place",
  });
  useEffect(() => {
    if (!canDeliver && deliveryType === "livraison") {
      setValue("deliveryType", "sur_place");
    }
  }, [canDeliver, deliveryType, setValue]);

  const total = watchItems.reduce(
    (sum, itm) => sum + (itm.price || 0) * (itm.quantity || 0),
    0,
  );

  return (
    <>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        Pour finaliser la commande on a besoin :
      </Typography>
      <hr className="my-2" />

      {/* Order recap — compact on mobile */}
      <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
        {watchItems.map((item, i) =>
          item.articleId ? (
            <div
              key={i}
              className="flex justify-between text-xs text-gray-700 py-0.5"
            >
              <span className="truncate mr-2">
                Article {i + 1} × {item.quantity || 0} {item.type}
              </span>
              <span className="font-medium flex-shrink-0 text-amber-700">
                {(item.price || 0) * (item.quantity || 0)} dt
              </span>
            </div>
          ) : null,
        )}
        <div className="border-t border-amber-200 mt-1.5 pt-1.5 flex justify-between text-sm font-semibold text-amber-800">
          <span>Total</span>
          <span>{total} dt</span>
        </div>
      </div>

      {/* Phone + Date — stacked on mobile, side by side on desktop */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Controller
            name="userPhoneNumber"
            control={control}
            rules={{
              required: "Téléphone requis",
              pattern: { value: /^[2459]\d{7}$/, message: "Numéro invalide" },
            }}
            render={({ field }) => (
              <TextField
                fullWidth
                size="small"
                label="Votre numéro de téléphone"
                inputMode="tel"
                {...field}
                error={!!errors.userPhoneNumber}
                helperText={errors.userPhoneNumber?.message}
                sx={{
                  "& label.Mui-focused": { color: "#d97706" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#d97706" },
                  },
                }}
              />
            )}
          />
        </div>

        <div className="flex-1">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="date"
              control={control}
              defaultValue={null}
              rules={{ required: "Date requise" }}
              render={({ field }) => (
                <DatePicker
                  label="Date souhaitée"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
                  minDate={today}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.date,
                      helperText: errors.date?.message,
                      color: "warning",
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#d97706",
                          },
                          "&:hover fieldset": {
                            borderColor: "#d97706",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#d97706",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#d97706",
                        },

                        "&.Mui-focused": {
                          outline: "none",
                          boxShadow: "none",
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>

      {/* Delivery type */}
      <div className="mt-4">
        <FormControl
          component="fieldset"
          error={!!errors.deliveryType}
          fullWidth
        >
          <FormLabel
            component="legend"
            sx={{
              fontSize: "0.8rem",
              color: "#d97706",
              "&.Mui-focused": { color: "#d97706" },
            }}
          >
            Comment souhaitez-vous récupérer votre commande ?
          </FormLabel>
          <Controller
            name="deliveryType"
            control={control}
            defaultValue="sur_place"
            rules={{ required: "Veuillez choisir une option" }}
            render={({ field }) =>
              canDeliver ? (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="sur_place"
                    control={
                      <Radio
                        sx={{
                          color: "#d97706",
                          "&.Mui-checked": { color: "#d97706" },
                          "& .MuiSvgIcon-root": { fontSize: 18 },
                        }}
                      />
                    }
                    label={<span className="text-sm">Sur place</span>}
                  />
                  <FormControlLabel
                    value="livraison"
                    control={
                      <Radio
                        sx={{
                          color: "#d97706",
                          "&.Mui-checked": { color: "#d97706" },
                          "& .MuiSvgIcon-root": { fontSize: 18 },
                        }}
                      />
                    }
                    label={<span className="text-sm">Livraison</span>}
                  />
                </RadioGroup>
              ) : (
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Retrait sur place uniquement (ce commerce ne propose pas la
                  livraison)
                </Typography>
              )
            }
          />
          {errors.deliveryType && (
            <Typography variant="caption" color="error">
              {errors.deliveryType.message}
            </Typography>
          )}
        </FormControl>

        {deliveryType === "livraison" && (
          <div className="mt-2 bg-orange-50 border border-orange-200 rounded px-3 py-2 text-xs text-orange-700">
            ⚠️ Les frais de livraison seront à régler directement au livreur.
          </div>
        )}
      </div>
    </>
  );
};

export default OrderSummary;
