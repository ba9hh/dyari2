import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dyari from "@/assets/dyari.svg";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { supabase } from "@/supabaseClient";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({ defaultValues: { email: "" } });

  const handleFieldChange = (onChange) => (e) => {
    if (submitError) setSubmitError("");
    clearErrors();
    onChange(e);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      // After the user clicks the link, Supabase redirects here.
      // Make sure this URL is whitelisted in Supabase → Auth → URL Configuration → Redirect URLs.
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setEmailSent(true);
  };

  return (
    <div className="bg-white border-2 border-gray-400 w-96 z-10 rounded-md">
      <form
        className="w-full flex flex-col gap-y-0 bg-white px-4 py-6 sm:px-10 sm:py-8 sm:rounded-md sm:shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Mot de passe oublié</Typography>
          <img src={dyari} className="w-8" />
        </div>

        {/* Error */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {emailSent ? (
          /* ── Success state ── */
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              Un e-mail de réinitialisation vous a été envoyé. Veuillez vérifier
              votre boîte de réception et cliquer sur le lien pour réinitialiser
              votre mot de passe.
            </Alert>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/login")}
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
              Retour à la connexion
            </Button>
          </>
        ) : (
          /* ── Form state ── */
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Entrez votre adresse e-mail et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </Typography>

            <div className="flex flex-col gap-y-3 mb-4">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Adresse e-mail requise",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Adresse e-mail invalide",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    label="Adresse e-mail"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    onChange={handleFieldChange(field.onChange)}
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

            <div className="flex flex-col gap-y-2">
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
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/login")}
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
                Retour à la connexion
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgetPassword;
