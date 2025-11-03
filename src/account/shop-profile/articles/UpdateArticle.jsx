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
import DyariLogo from "../../../components/DyariLogo";
import { AuthContext } from "../../../AuthProvider";
import { toast } from "react-toastify";
import { supabase } from "../../../supabaseClient";

const UpdateArticle = () => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      type: "kg",
      price: "",
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
      const { data: art, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) {
        console.error(error);
        toast.error("Failed to load article.");
        navigate("/account");
        return;
      }
      if (art.shop_id !== user.id) {
        navigate("/");
        return;
      }

      reset({
        title: art.article_title,
        type: art.article_type,
        price: art.article_price,
        image: null,
      });
      setImagePreview(art.article_image);
    };

    fetchArticle();
  }, [articleId, reset, user, navigate]);

  if (!user || user.role !== "shop") {
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
        toast.error("Image upload failed.");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("articles")
        .getPublicUrl(fileName);

      uploadedImageUrl = publicUrlData.publicUrl;
    }

    // Update the article
    const { error: updateError } = await supabase
      .from("articles")
      .update({
        shop_id: user.id,
        article_title: data.title,
        article_type: data.type,
        article_price: data.price,
        article_image: uploadedImageUrl,
      })
      .eq("id", articleId);

    if (updateError) {
      console.error("Error updating article:", updateError);
      toast.error("Failed to update article.");
    } else {
      toast.success("Article updated successfully!");
      navigate("/account");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-white sm:bg-[#f5f5f5] pt-16 pb-8">
      <DyariLogo />
      <div className="bg-white px-10 py-6 rounded-md shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxWidth: 500, margin: "auto" }}
        >
          <Typography variant="h5" gutterBottom>
            Update Article
          </Typography>

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div style={{ marginBottom: 20 }}>
                <Button variant="contained" component="label">
                  {file ? "Change Image" : "Upload Image"}
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
                    style={{
                      display: "block",
                      marginTop: 10,
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
              </div>
            )}
          />

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField label="Title" fullWidth margin="normal" {...field} />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Unité de vente</InputLabel>
                <Select label="Unité de vente" {...field}>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="piece">Piece</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                label="Prix"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                {...field}
              />
            )}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default UpdateArticle;
