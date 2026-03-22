import { Link } from "react-router-dom";
import loginbg from "@/assets/loginbg.jpg";
import { useState, useEffect, useContext } from "react";
// import { AuthContext } from "@/AuthProvider";
import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import dyari from "@/assets/dyari.svg";

import {
  TextField,
  Button,
  Link as MuiLink,
  Typography,
  Box,
} from "@mui/material";
// import { supabase } from "@/supabaseClient";
const Signup = () => {
  //   const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  //   useEffect(() => {
  //     if (user) {
  //       navigate("/");
  //     }
  //   }, [user, navigate]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleFieldChange = (onChange) => (e) => {
    if (loginError) setLoginError("");
    clearErrors();
    onChange(e);
  };
  const onSubmit = async (data) => {
    setLoginError("");
    setIsLoading(true);
    // try {
    //   // Supabase login
    //   const { data: authData, error } = await supabase.auth.signInWithPassword({
    //     email: data.email,
    //     password: data.password,
    //   });

    //   if (error) {
    //     throw error;
    //   }

    //   // authData.user → authenticated user
    //   //   setUser(authData.user);
    //   navigate("/");
    // } catch (err) {
    //   console.error("Login failed", err);
    //   setLoginError(err.message || "Invalid email or password.");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <div className="bg-white border-2 border-gray-400 w-96 z-10 rounded-md">
      <form
        className="w-full flex flex-col gap-y-0 bg-white px-10 py-8 sm:rounded-md sm:shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">S'inscrire à Dyari</Typography>
          <img src={dyari} className="w-8" />
        </div>
        {loginError && (
          <Typography color="error" textAlign="center">
            {loginError}
          </Typography>
        )}

        <div className="flex flex-col gap-y-3">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Nom complet est requis" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nom complet"
                fullWidth
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
            )}
          />
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
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: "Mot de passe requis" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Mot de passe"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                onChange={handleFieldChange(field.onChange)}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-y-2 mb-8 pt-4">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={() => navigate("/role-selection")}
            sx={{
              textTransform: "none",
              backgroundColor: "#d97706",
              "&:hover": {
                backgroundColor: "#b45309",
              },
            }}
            disabled={isLoading || Boolean(loginError)}
          >
            {isLoading ? "Connexion..." : "S'inscrire"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              textTransform: "none",
              color: "#d97706",
              borderColor: "#d97706",
              "&:hover": {
                borderColor: "#b45309",
                backgroundColor: "rgba(217, 119, 6, 0.04)",
              },
            }}
            onClick={() => navigate("/login")}
          >
            j'ai déjà un compte
          </Button>
        </div>
        <div className="bg-white rounded-sm shadow-sm hover:bg-gray-100 cursor-pointer">
          <GoogleLoginButton onClick={""} />
        </div>
      </form>
    </div>
  );
};

export default Signup;
