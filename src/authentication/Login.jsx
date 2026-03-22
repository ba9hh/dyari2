import React from "react";
import loginbg from "@/assets/loginbg.jpg";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
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
import { supabase } from "@/supabaseClient";

const Login = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: { email: "", password: "" },
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
    try {
      // Supabase login
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // authData.user → authenticated user
      setUser(authData.user);
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setLoginError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className="w-full flex flex-col gap-y-0 bg-white px-10 pb-8 pt-8 sm:rounded-md sm:shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6">Se connecter à Dyari</Typography>
        <img src={dyari} className="w-8" />
      </div>
      {loginError && (
        <Typography color="error" textAlign="center">
          {loginError}
        </Typography>
      )}

      <div className="flex flex-col gap-y-3">
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
      <div className="flex flex-col gap-y-2 mb-8 pt-1">
        <MuiLink
          component={RouterLink}
          to="/forget-password"
          textAlign="right"
          sx={{ color: "black", fontSize: "12px" }}
          underline="none"
        >
          Mot de passe oublié ?
        </MuiLink>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            textTransform: "none",
            backgroundColor: "#d97706",
            "&:hover": {
              backgroundColor: "#b45309",
            },
          }}
          disabled={isLoading || Boolean(loginError)}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/signup")}
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
          Créer un nouveau compte
        </Button>
      </div>
      <div className="bg-white rounded-sm shadow-sm hover:bg-gray-100 cursor-pointer">
        <GoogleLoginButton onClick={""} />
      </div>
    </form>
  );
};

export default Login;
