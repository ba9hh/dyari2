import React from "react";
import loginbg from "@/assets/loginbg.jpg";
import dyari from "@/assets/dyari.svg";
import {
  Typography,
  Select,
  TextField,
  Radio,
  MenuItem,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { CircleCheckBig } from "lucide-react";
import PLANS from "@/data/PLANS";
import SPECIALITIES from "@/data/SPECIALITIES";
import CITIES from "@/data/CITIES";
const ShopForm = () => {
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
    },
  });
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // TODO: send data to your API
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <img
        src={loginbg}
        className="absolute inset-0 h-screen w-full object-cover"
      />
      <div className="bg-white border-2 border-gray-400 rounded-md p-6 z-10">
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
                  />
                )}
              />
              <Controller
                name="location"
                control={control}
                rules={{ required: "Localisation requise" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    displayEmpty
                    error={!!errors.localisation}
                  >
                    <MenuItem value="" disabled>
                      Choisir une délégation
                    </MenuItem>
                    {CITIES.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>
            <Controller
              name="speciality"
              control={control}
              rules={{ required: "Spécialité requise" }}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  displayEmpty
                  error={!!errors.speciality}
                >
                  <MenuItem value="" disabled>
                    Choisir une spécialité
                  </MenuItem>
                  {SPECIALITIES.map((speciality) => (
                    <MenuItem key={speciality} value={speciality}>
                      {speciality}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <Controller
            name="plan"
            control={control}
            rules={{ required: "Veuillez choisir une offre" }}
            render={({ field }) => (
              <>
                <div className="flex gap-3 mt-6">
                  {PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className="w-1/3 flex flex-col border rounded-t-md cursor-pointer"
                      onClick={() => field.onChange(plan.id)}
                    >
                      <h1 className="bg-amber-600 text-white text-center rounded-t-md">
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
          />
          <div className="flex mt-4">
            {/* <button
              type="submit"
              className="w-full px-2 border border-amber-700 text-amber-700 mt-4 text-base hover:bg-amber-700 hover:text-white transition-colors cursor-pointer"
            >
              Continue
            </button> */}
            <Button
              variant="outlined"
              fullWidth
              // onClick={() => navigate("/signup")}
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

export default ShopForm;
