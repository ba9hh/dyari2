import { useState, useEffect, useContext } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "@/AuthProvider";
import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import dyari from "@/assets/dyari.svg";

const UpdateArticle = () => {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
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
  const { articleId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchArticle = async () => {
      const { data: article, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) {
        console.error(error);
        toast.error("Échec du chargement de l'article.");
        navigate("/compte");
        return;
      }
      // if (article.shop_id !== user.id) {
      //   navigate("/");
      //   return;
      // }

      reset({
        title: article.article_title,
        type: article.article_type,
        price: article.article_price,
        minQuantity: article.article_min_quantity,
        maxQuantity: article.article_max_quantity,
        image: null,
      });
      setImagePreview(article.article_image);
    };

    fetchArticle();
  }, [articleId, reset, user, navigate]);

  if (!user || user.role !== "vendeur") {
    navigate("/");
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    let uploadedImageUrl = imagePreview;

    // If a new file is selected, upload it to Supabase Storage
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("articles") // your storage bucket name
        .upload(fileName, file);

      if (storageError) {
        console.error("Error uploading image:", storageError);
        toast.error("Échec de l'upload de l'image.");
        setLoading(false);
        return;
      }

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
    // Update the article
    const { error: updateError } = await supabase
      .from("articles")
      .update({
        shop_id: shop.id,
        article_title: data.title,
        article_type: data.type,
        article_price: data.price,
        article_min_quantity: data.minQuantity,
        article_max_quantity: data.maxQuantity,
        article_image: uploadedImageUrl,
      })
      .eq("id", articleId);

    if (updateError) {
      console.error("Error updating article:", updateError);
      toast.error("Échec de la mise à jour de l'article.");
    } else {
      toast.success("Article mis à jour avec succès !");
      navigate("/compte");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center sm:items-center w-full sm:min-h-screen bg-white sm:bg-gray-100/50 sm:pt-16 sm:pb-8">
      <div className="bg-white px-3 sm:px-10 sm:py-6 sm:rounded-md sm:shadow-md pb-3 border-b sm:border-b-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxWidth: 500, margin: "auto" }}
        >
          <div className="flex justify-between items-center sm:mt-0 my-3 sm:mb-4">
            <Typography variant="h6">Mettre à jour l’article</Typography>
            <img src={dyari} className="w-6 sm:w-7" />
          </div>
          <hr className="mb-6" />
          <Controller
            name="image"
            control={control}
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
                  {file
                    ? "Modifier l'image de l'article"
                    : "Modifier l'image de l'article"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      setFile(f);
                      field.onChange(f);
                      setImagePreview(f ? URL.createObjectURL(f) : null);
                    }}
                  />
                </Button>
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
            render={({ field }) => (
              <TextField
                label="Nom de l'article"
                fullWidth
                margin="normal"
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
            render={({ field }) => (
              <TextField
                label="Prix de l'article"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
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
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{
                textTransform: "none",
                backgroundColor: "#d97706",
                "&:hover": {
                  backgroundColor: "#b45309",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default UpdateArticle;
