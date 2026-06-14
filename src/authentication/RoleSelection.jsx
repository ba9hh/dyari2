import React, { useContext, useState } from "react";
import Radio from "@mui/material/Radio";
import dyari from "@/assets/dyari.svg";
import { Typography, Button, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/AuthProvider";
import { supabase } from "@/supabaseClient";
const ROLES = [
  { value: "client", label: "Client", suffix: "(default)" },
  { value: "vendeur", label: "Vendeur", suffix: null },
];

const radioSx = {
  color: "#d97706",
  "&.Mui-checked": { color: "#d97706" },
  "& .MuiSvgIcon-root": { fontSize: 16 },
};
const RoleSelection = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { role: "client" },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");

    if (!user) {
      setSubmitError("Utilisateur non authentifié. Veuillez vous reconnecter.");
      setIsLoading(false);
      return;
    }

    if (data.role === "vendeur") {
      // CHANGED: if vendeur, do NOT write anything to DB yet —
      // role + has_selected_role will be set only after ShopForm is completed
      navigate("/shop-creation");
      setIsLoading(false);
      return;
    }

    // CHANGED: only write to DB here for client —
    // role stays 'client' (already the default, no need to update it),
    // just mark has_selected_role = true so they don't see this screen again
    const { error } = await supabase
      .from("users")
      .update({ has_selected_role: true })
      .eq("id", user.id);

    if (error) {
      setSubmitError(error.message);
      setIsLoading(false);
      return;
    }

    // CHANGED: only update has_selected_role in context, role is already 'client'
    setUser({ ...user, has_selected_role: true });

    setIsLoading(false);
    navigate("/");
  };
  return (
    <div className="bg-white border-2 border-gray-400 rounded-md p-6 z-10">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6">S'inscrire en tant que:</Typography>
        <img src={dyari} className="w-8" />
      </div>
      <hr className="mb-4" />
      {submitError && (
        <p className="text-red-500 text-sm mb-3">{submitError}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="role"
          control={control}
          rules={{ required: "Veuillez choisir un rôle" }}
          render={({ field }) => (
            <div className="flex gap-2 mb-4">
              {ROLES.map((role) => (
                <div
                  key={role.value}
                  className="flex items-center border w-52 cursor-pointer"
                  onClick={() => field.onChange(role.value)}
                >
                  <Radio
                    sx={radioSx}
                    checked={field.value === role.value}
                    onChange={() => field.onChange(role.value)}
                    value={role.value}
                    inputProps={{ "aria-label": role.label }}
                  />
                  <h1 className="text-md text-gray-700 -ml-1">
                    {role.label}{" "}
                    {role.suffix && (
                      <span className="font-light">{role.suffix}</span>
                    )}
                  </h1>
                </div>
              ))}
            </div>
          )}
        />
        {errors.role && (
          <p className="text-red-500 text-xs mb-2">{errors.role.message}</p>
        )}
        <hr className="mt-1" />
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
            {isLoading ? "Enregistrement..." : "Continuer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleSelection;
