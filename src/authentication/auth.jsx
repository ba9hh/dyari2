import vendor from "@/assets/vendor.jpeg";
import customer from "@/assets/customer1.png";
import { Link } from "react-router-dom";
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
const Auth = () => {
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
    <div className="flex justify-center items-center h-screen">
      <img
        src={loginbg}
        className="absolute inset-0 h-screen w-full object-cover"
      />
      <div className="bg-white border-2 border-gray-400 w-96 z-10 rounded-md">
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
              {isLoading ? "Connexion..." : "Créer un nouveau compte"}
            </Button>
          </div>
          <div className="bg-white rounded-sm shadow-sm hover:bg-gray-100 cursor-pointer">
            <GoogleLoginButton onClick={""} />
          </div>
        </form>
      </div>
    </div>
    // <div className="flex flex-col justify-center items-center w-full h-screen sm:bg-[#f5f5f5] bg-white gap-4 sm:gap-6">
    //   <h1 className=" text-amber-600">Se connecter en mode :</h1>
    //   <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
    //     <div className="w-full sm:w-[26%] flex flex-col gap-y-5 ">
    //       <Link
    //         to={"/auth/customer"}
    //         className="bg-white p-2 sm:px-10 sm:py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer"
    //       >
    //         <h1>
    //           <span className="font-semibold">Client</span> : Pour passer des
    //           commandes
    //         </h1>
    //       </Link>
    //       <Link
    //         to={"/auth/customer"}
    //         className="bg-white p-8 sm:px-10 sm:py-8 rounded-md shadow-md hover:bg-gray-100 cursor-pointer sm:block hidden"
    //       >
    //         <img src={customer} className="w-full object-cover " />
    //       </Link>
    //     </div>
    //     <div className="block sm:hidden text-amber-600 py-1">Ou</div>
    //     <div className="w-full sm:w-[26%] flex flex-col gap-y-5 ">
    //       <Link
    //         to={"/auth/vendor"}
    //         className="bg-white p-2 sm:px-10 sm:py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer"
    //       >
    //         <h1>
    //           <span className="font-semibold">Vendeur</span> : Pour publier vos
    //           travails
    //         </h1>
    //       </Link>
    //       <Link
    //         to={"/auth/vendor"}
    //         className="bg-white p-8 sm:px-10 sm:py-8 rounded-md shadow-md hover:bg-gray-100 cursor-pointer sm:block hidden"
    //       >
    //         <img src={vendor} className="w-full object-cover" />
    //       </Link>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Auth;
