import React from "react";
import Radio from "@mui/material/Radio";
import loginbg from "@/assets/loginbg.jpg";
import dyari from "@/assets/dyari.svg";
import { Typography, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "client",
    },
  });
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log("Role selected:", data);
    // TODO: navigate or call API based on selected role
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <img
        src={loginbg}
        className="absolute inset-0 h-screen w-full object-cover"
      />
      <div className="bg-white border-2 border-gray-400 rounded-md p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">S'inscrire en tant que:</Typography>
          <img src={dyari} className="w-8" />
        </div>
        <hr className="mb-4" />
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
            {/* <button className="w-full px-2 border border-amber-700 text-amber-700 mt-4 text-base hover:bg-amber-700 hover:text-white transition-colors cursor-pointer">
              Continue
            </button> */}
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/shop-creation")}
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
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;
