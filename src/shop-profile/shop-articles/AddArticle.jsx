import { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/AuthProvider";
import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import dyari from "@/assets/dyari.svg";

const AddArticle = () => {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: "",
      type: "kg",
      price: "",
      minQuantity: "",
      maxQuantity: "",
      image: null,
    },
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    let uploadedImageUrl = "";

    try {
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: storageError } = await supabase.storage
          .from("articles")
          .upload(fileName, file);

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from("articles")
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrlData.publicUrl;
      }
      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (shopError) throw shopError;
      const { error: insertError } = await supabase.from("articles").insert([
        {
          shop_id: shop?.id,
          article_title: data.title,
          article_type: data.type,
          article_price: data.price,
          article_min_quantity: data.minQuantity,
          article_max_quantity: data.maxQuantity,
          article_image: uploadedImageUrl,
        },
      ]);
      if (insertError) throw insertError;

      toast.success("Article added successfully!");
      navigate("/account");
    } catch (error) {
      console.error("Error adding article:", error.message);
      toast.error("Failed to add article. Please try again.");
    }
    setLoading(false);
  };

  const handleSaveAndAddAnother = async (data) => {
    setLoading(true);
    let uploadedImageUrl = "";

    try {
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: storageError } = await supabase.storage
          .from("articles")
          .upload(fileName, file);

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from("articles")
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrlData.publicUrl;
      }
      const { error: insertError } = await supabase.from("articles").insert([
        {
          shop_id: user?.id,
          article_title: data.title,
          article_type: data.type,
          article_price: data.price,
          article_min_quantity: data.minQuantity,
          article_max_quantity: data.maxQuantity,
          article_image: uploadedImageUrl,
        },
      ]);
      if (insertError) throw insertError;
      toast.success("Article added successfully!");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding article:", error.message);
      toast.error("Failed to add article. Please try again.");
    }
    setLoading(false);
  };

  // if (!user) {
  //   navigate("/");
  // } else if (user.role != "shop") {
  //   navigate("/");
  // }
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-white sm:bg-[#f5f5f5] pt-16 pb-8">
      <div className="bg-white px-10 py-6 rounded-md shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxWidth: 500, margin: "auto" }}
        >
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Ajouter un nouvel article</Typography>
            <img src={dyari} className="w-7" />
          </div>
          <hr className="mb-6" />
          <Controller
            name="image"
            control={control}
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <div style={{ marginBottom: 8 }}>
                <Button
                  variant="outlined"
                  component="label"
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
                  Télécharger l'image de l'article
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFile(file);
                      field.onChange(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                </Button>
                {errors.image && (
                  <Typography color="error">{errors.image.message}</Typography>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 aspect-square object-cover mt-6"
                  />
                )}
              </div>
            )}
          />

          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextField
                label="Nom de l'article"
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...field}
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
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  "& label.Mui-focused": { color: "#d97706" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#d97706" },
                  },
                }}
              >
                <InputLabel>Unité de vente</InputLabel>
                <Select label="Unité de vente" {...field}>
                  <MenuItem value="kg">Par kg</MenuItem>
                  <MenuItem value="piece">Par piece</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={{
              required: "Price is required",
              min: { value: 0.01, message: "Price must be greater than 0" },
            }}
            render={({ field }) => (
              <TextField
                label="Prix de l'article"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0.01, step: 0.01 }}
                error={!!errors.price}
                helperText={errors.price?.message}
                {...field}
                sx={{
                  "& label.Mui-focused": { color: "#d97706" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#d97706" },
                  },
                }}
              />
            )}
          />
          <div className="flex gap-2">
            <Controller
              name="minQuantity"
              control={control}
              rules={{
                required: "La quantité minimale est requise",
                min: {
                  value: 0.01,
                  message: "La quantité doit être supérieure à 0",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Quantité minimale"
                  type="number"
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 0.01, step: 0.01 }}
                  error={!!errors.minQuantity}
                  helperText={errors.minQuantity?.message}
                  {...field}
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
              name="maxQuantity"
              control={control}
              rules={{
                required: "La quantité maximale est requise",
                min: {
                  value: 0.01,
                  message: "La quantité doit être supérieure à 0",
                },
                validate: (value) =>
                  Number(value) >= Number(getValues("minQuantity")) ||
                  "Doit être ≥ à la quantité minimale",
              }}
              render={({ field }) => (
                <TextField
                  label="Quantité maximale"
                  type="number"
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 0.01, step: 0.01 }}
                  error={!!errors.maxQuantity}
                  helperText={errors.maxQuantity?.message}
                  {...field}
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

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleSubmit(handleSaveAndAddAnother)}
              fullWidth
              sx={{ flex: 1, textTransform: "none" }}
              disabled={!isValid || loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Enregistrer & Ajouter Un Autre"
              )}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid || loading}
              sx={{
                flex: 1,
                textTransform: "none",
                backgroundColor: "#d97706",
                "&:hover": {
                  backgroundColor: "#b45309",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Enregistrer"}
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;
