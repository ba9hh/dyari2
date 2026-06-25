import { useState, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import dyari from "@/assets/dyari.svg";
import {
  Typography,
  Select,
  TextField,
  Radio,
  MenuItem,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { CircleCheckBig } from "lucide-react";
import PLANS from "@/data/PLANS";
import SPECIALITIES from "@/data/specialities";
import CITIES from "@/data/cities";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
const ShopForm = () => {
  const { user, setUser } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: "",
      location: "",
      speciality: "",
      plan: "starter",
      userPhoneNumber: "",
      bio: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");
    console.log("Form Data:", data); // Debug log
    if (!user) {
      setSubmitError("Utilisateur non authentifié. Veuillez vous reconnecter.");
      setIsLoading(false);
      return;
    }

    // 2. Insert into public.vendeurs
    const { error: shopError } = await supabase.from("shops").insert({
      user_id: user.id,
      business_name: data.projectName,
      address: data.location,
      category: data.speciality,
      offer_plan: data.plan,
      phone_number: data.userPhoneNumber,
      bio: data.bio || null,
    });

    if (shopError) {
      console.log("shop Insert Result:", shopError); // Debug log
      setSubmitError(shopError.message);
      setIsLoading(false);
      return;
    }

    // 3. Update role to 'vendeur' in public.users
    const { error: roleError } = await supabase
      .from("users")
      .update({ role: "vendeur" })
      .eq("id", user.id);

    if (roleError) {
      console.log("Role Update Result:", roleError); // Debug log
      setSubmitError(roleError.message);
      setIsLoading(false);
      return;
    }
    setUser({ ...user, role: "vendeur" });
    // 4. Navigate to the vendor dashboard (adjust route as needed)
    navigate("/account");
  };
  return (
    <div className="bg-white border-2 md:w-2/5 border-gray-400 rounded-md p-6 z-10">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6">Remplir le formulaire:</Typography>
        <img src={dyari} className="w-8" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-3">
          <div className="flex gap-2">
            <Controller
              name="projectName"
              control={control}
              rules={{ required: "Nom de projet requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom de projet"
                  fullWidth
                  error={!!errors.projectName}
                  helperText={errors.projectName?.message}
                  sx={{
                    "& label.Mui-focused": { color: "#d97706" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#d97706" },
                    },
                  }}
                />
              )}
            />
            <Controller
              name="location"
              control={control}
              rules={{ required: "Localisation requise" }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.location}
                  sx={{
                    "& label.Mui-focused": { color: "#d97706" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#d97706" },
                    },
                  }}
                >
                  <InputLabel>Délégation</InputLabel>
                  <Select {...field} label="Délégation">
                    <MenuItem value="" disabled>
                      Choisir une délégation
                    </MenuItem>
                    {CITIES.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.location && (
                    <FormHelperText>{errors.location.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Controller
              name="speciality"
              control={control}
              rules={{ required: "Spécialité requise" }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.speciality}
                  sx={{
                    "& label.Mui-focused": { color: "#d97706" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#d97706" },
                    },
                  }}
                >
                  <InputLabel>Spécialité</InputLabel>
                  <Select {...field} label="Spécialité">
                    <MenuItem value="" disabled>
                      Choisir une spécialité
                    </MenuItem>
                    {SPECIALITIES.map((speciality) => (
                      <MenuItem key={speciality} value={speciality}>
                        {speciality}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.speciality && (
                    <FormHelperText>{errors.speciality.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
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
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Bio (optionnel)"
                fullWidth
                multiline
                rows={1}
                inputProps={{ maxLength: 70 }}
                sx={{
                  "& label.Mui-focused": { color: "#d97706" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#d97706" },
                  },
                }}
                // helperText={`${field.value?.length || 0}/150`}
                // FormHelperTextProps={{ sx: { textAlign: "right" } }}
              />
            )}
          />
        </div>
        {/* <Controller
          name="plan"
          control={control}
          rules={{ required: "Veuillez choisir une offre" }}
          render={({ field }) => (
            <>
              <div className="flex gap-3 mt-6">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="w-1/3 flex flex-col border cursor-pointer"
                    onClick={() => field.onChange(plan.id)}
                  >
                    <h1 className="bg-amber-600 text-white text-center">
                      {plan.label}
                    </h1>
                    <h1 className="text-center text-sm mt-2">{plan.price}</h1>
                    <hr className="mt-1" />
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-1 mt-1 px-1"
                      >
                        <CircleCheckBig className="w-4 text-green-500 shrink-0" />
                        <h1 className="text-sm truncate">{feature}</h1>
                      </div>
                    ))}
                    <hr className="mt-1" />
                    <div className="flex justify-center">
                      <Radio
                        sx={{
                          color: "#d97706",
                          "&.Mui-checked": { color: "#d97706" },
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                        }}
                        checked={field.value === plan.id}
                        onChange={() => field.onChange(plan.id)}
                        value={plan.id}
                        inputProps={{ "aria-label": plan.label }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {errors.plan && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.plan.message}
                </p>
              )}
            </>
          )}
        /> */}
        <div className="flex mt-4">
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={16} sx={{ color: "#d97706" }} />
              ) : null
            }
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
            {isLoading ? "Envoi en cours..." : "Continuer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShopForm;
