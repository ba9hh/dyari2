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
  FormLabel,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
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
      canDeliver: "no",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");
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
      can_deliver: data.canDeliver === "yes",
    });

    if (shopError) {
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
      setSubmitError(roleError.message);
      setIsLoading(false);
      return;
    }
    setUser({ ...user, role: "vendeur" });
    // 4. Navigate to the vendor dashboard (adjust route as needed)
    navigate("/compte");
  };
  return (
    <div className="bg-white border-2 w-96 sm:w-2/5 border-gray-400 rounded-md p-6 z-10">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6">Remplir le formulaire:</Typography>
        <img src={dyari} className="sm:w-8 w-7" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
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
          <div className="flex flex-col sm:flex-row gap-2">
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
          <Controller
            name="canDeliver"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel
                  sx={{
                    fontSize: "0.85rem",
                    color: "#d97706",
                    "&.Mui-focused": { color: "#d97706" },
                  }}
                >
                  Pouvez-vous livrer les commandes ?
                </FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        sx={{
                          color: "#d97706",
                          "&.Mui-checked": { color: "#d97706" },
                        }}
                      />
                    }
                    label="Oui"
                  />
                  <FormControlLabel
                    value="no"
                    control={
                      <Radio
                        sx={{
                          color: "#d97706",
                          "&.Mui-checked": { color: "#d97706" },
                        }}
                      />
                    }
                    label="Non"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>
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
