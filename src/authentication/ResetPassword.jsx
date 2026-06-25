import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dyari from "@/assets/dyari.svg";
import {
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { supabase } from "@/supabaseClient";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm({ defaultValues: { password: "", confirmPassword: "" } });

  const handleFieldChange = (onChange) => (e) => {
    if (submitError) setSubmitError("");
    clearErrors();
    onChange(e);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");

    // Supabase automatically picks up the session from the URL hash
    // that was set when the user clicked the reset link.
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setSuccess(true);
    // Redirect to account after a short delay
    setTimeout(() => navigate("/account"), 2500);
  };

  return (
    <div className="bg-white border-2 border-gray-400 w-96 z-10 rounded-md">
      <form
        className="w-full flex flex-col gap-y-0 bg-white px-4 py-6 sm:px-10 sm:py-8 sm:rounded-md sm:shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Réinitialiser le mot de passe</Typography>
          <img src={dyari} className="w-8" />
        </div>

        {/* Error */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {success ? (
          <Alert severity="success">
            Mot de passe mis à jour avec succès ! Vous allez être redirigé…
          </Alert>
        ) : (
          <>
            <div className="flex flex-col gap-y-3 mb-4">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Mot de passe requis",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 caractères",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPassword ? "text" : "password"}
                    label="Nouveau mot de passe"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    onChange={handleFieldChange(field.onChange)}
                    sx={{
                      "& label.Mui-focused": { color: "#d97706" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#d97706" },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((p) => !p)}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirmation requise",
                  validate: (value) =>
                    value === watch("password") ||
                    "Les mots de passe ne correspondent pas",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showConfirm ? "text" : "password"}
                    label="Confirmer le mot de passe"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    onChange={handleFieldChange(field.onChange)}
                    sx={{
                      "& label.Mui-focused": { color: "#d97706" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#d97706" },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm((p) => !p)}
                            edge="end"
                          >
                            {showConfirm ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                textTransform: "none",
                backgroundColor: "#d97706",
                "&:hover": { backgroundColor: "#b45309" },
              }}
            >
              {isLoading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
