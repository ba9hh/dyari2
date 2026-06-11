import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import pdp from "@/assets/pdp.png";

const UserProfilePicture = ({
  open,
  setOpen,
  user,
  file,
  setFile,
  preview,
  setPreview,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
    setFile(null);
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-picture")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("profile-picture")
          .getPublicUrl(fileName);

        const uploadedImageUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
          .from("users")
          .update({ profile_picture: uploadedImageUrl })
          .eq("id", userId);

        if (updateError) throw updateError;
      }
      handleClose();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Mise à jour de la photo de profil</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <div className="flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <Avatar
                src={user ? user.profile_picture : pdp}
                sx={{ width: 128, height: 128 }}
              />
            )}
          </div>
          <Button
            variant="outlined"
            component="label"
            sx={{
              px: 12,
              textTransform: "none",
              color: "#d97706",
              borderColor: "#d97706",
              "&:hover": {
                borderColor: "#b45309",
                backgroundColor: "rgba(217, 119, 6, 0.04)",
              },
            }}
          >
            Telecharger une nouvelle photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ textTransform: "none" }}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading || !file}
          sx={{
            textTransform: "none",
            backgroundColor: "#d97706",
            "&:hover": {
              backgroundColor: "#b45309",
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfilePicture;
