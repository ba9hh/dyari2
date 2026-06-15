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

const OrderSummary = ({ control, errors, watchItems, today }) => {
  const deliveryType = useWatch({
    control,
    name: "deliveryType",
    defaultValue: "sur_place",
  });
  return (
    <>
      <Typography variant="subtitle2">
        Pour finaliser la commande on a besoin :
      </Typography>
      <h1 className=""></h1>
      <hr className="my-2" />
      {/* Delivery / pickup choice */}
      <div className="flex flex-col sm:flex-row gap-2 mt-6">
        {/* Phone number */}
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
                label="Votre numéro de téléphone"
                {...field}
                error={!!errors.userPhoneNumber}
                helperText={errors.userPhoneNumber?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
        </div>

        {/* Date */}
        <div className="flex-1">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="date"
              control={control}
              defaultValue={null}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  label="Quand besoin commande"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
                  minDate={today}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              )}
            />
            {errors.date && (
              <Typography
                variant="caption"
                color="error"
                sx={{ marginLeft: "14px" }}
              >
                {errors.date.message}
              </Typography>
            )}
          </LocalizationProvider>
        </div>
      </div>
      <div className="mt-2">
        <FormControl
          component="fieldset"
          error={!!errors.deliveryType}
          fullWidth
        >
          <FormLabel
            component="legend"
            sx={{
              color: "#d97706",
              "&.Mui-focused": { color: "#d97706" }, // prevents MUI's default blue focus override
            }}
          >
            Comment souhaitez-vous récupérer votre commande ?
          </FormLabel>
          <Controller
            name="deliveryType"
            control={control}
            defaultValue="sur_place"
            rules={{ required: "Veuillez choisir une option" }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="sur_place"
                  control={
                    <Radio
                      sx={{
                        color: "#d97706",
                        "&.Mui-checked": { color: "#d97706" },
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                      }}
                    />
                  }
                  label="Sur place"
                />
                <FormControlLabel
                  value="livraison"
                  control={
                    <Radio
                      sx={{
                        color: "#d97706",
                        "&.Mui-checked": { color: "#d97706" },
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                      }}
                    />
                  }
                  label="Livraison"
                />
              </RadioGroup>
            )}
          />
          {errors.deliveryType && (
            <Typography variant="caption" color="error">
              {errors.deliveryType.message}
            </Typography>
          )}
        </FormControl>

        {deliveryType === "livraison" && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            ⚠️ Les frais de livraison seront à régler directement au livreur.
          </Typography>
        )}
      </div>

      {/* Total */}
      {/* <Typography variant="h6" align="center" sx={{ mb: 2, width: "100%" }}>
        Total:{" "}
        {watchItems.reduce(
          (sum, itm) => sum + (itm.price || 0) * (itm.quantity || 0),
          0,
        )}{" "}
        dt
      </Typography> */}
    </>
  );
};

export default OrderSummary;
