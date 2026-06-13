import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Divider,
  useTheme,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import { toast } from "react-toastify";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import {
  TextField,
  Button,
  Link as MuiLink,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { supabase } from "@/supabaseClient";
import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const LoginRequiredDialog = ({
  open,
  onClose,
  message = "You must be logged in to perform this action.",
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { handleGoogleLogin, loginWithGoogle } = useContext(AuthContext);
  const theme = useTheme();
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
      //   setUser(authData.user);
      // navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setLoginError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          py: 1,
        }}
      >
        <DialogTitle sx={{ textAlign: "center", m: 0, fontSize: "1.2rem" }}>
          Authentication Required
        </DialogTitle>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ textAlign: "center", pt: 3, px: 4, pb: 6 }}>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
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
              name="password"
              control={control}
              rules={{ required: "Mot de passe requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showPassword ? "text" : "password"}
                  label="Mot de passe"
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
                          onClick={() => setShowPassword((prev) => !prev)}
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
          </div>
          <div className="flex flex-col gap-y-2 mb-6 pt-1">
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
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <h1 className=" text-gray-600 mx-4">Ou se connecter avec</h1>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="bg-white rounded-sm shadow-sm hover:bg-gray-100 cursor-pointer">
            <GoogleLoginButton onClick={loginWithGoogle} />
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;
