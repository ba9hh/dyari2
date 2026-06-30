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
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import pdp from "@/assets/pdp.png";

const DEFAULT_PROFILE_PICTURE =
  "https://obhlpgxxiotewfhcvdaw.supabase.co/storage/v1/object/public/images/1753197818753-icon-7797704_640.png";

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
  const [resetToDefault, setResetToDefault] = useState(false);

  const hasCustomPicture =
    user?.avatar_url && user.avatar_url !== DEFAULT_PROFILE_PICTURE;

  const handleClose = () => {
    setOpen(false);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setResetToDefault(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); // ✅ Fixed: removed the erroneous setFile(null) that was here
    setResetToDefault(false);
    setPreview(URL.createObjectURL(f));
  };

  const handleDeletePicture = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setResetToDefault(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (resetToDefault) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ avatar_url: DEFAULT_PROFILE_PICTURE })
          .eq("id", userId);
        if (updateError) throw updateError;

        toast.success("Photo réinitialisée !");
        handleClose();
      } else if (file) {
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
          .update({ avatar_url: uploadedImageUrl })
          .eq("id", userId);
        if (updateError) throw updateError;

        toast.success("Photo mise à jour !");
        handleClose();
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Échec de la mise à jour de la photo.");
    } finally {
      setLoading(false);
    }
  };

  const previewSrc = resetToDefault
    ? DEFAULT_PROFILE_PICTURE
    : preview || user?.avatar_url || DEFAULT_PROFILE_PICTURE;

  const canUpdate = file || resetToDefault;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Mise à jour de la photo de profil</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <div className="flex justify-center">
            <div className="relative inline-block">
              <Avatar src={previewSrc} sx={{ width: 128, height: 128 }} />
              {(hasCustomPicture || file) && !resetToDefault && (
                <Tooltip title="Supprimer la photo">
                  <IconButton
                    onClick={handleDeletePicture}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#dc2626" },
                      width: 28,
                      height: 28,
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>

          {resetToDefault && (
            <p className="text-center text-sm text-gray-500">
              La photo sera réinitialisée à celle par défaut.
            </p>
          )}

          <Button
            variant="outlined"
            component="label"
            disabled={loading}
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
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading || !canUpdate}
          sx={{
            textTransform: "none",
            backgroundColor: "#d97706",
            "&:hover": { backgroundColor: "#b45309" },
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Mettre à jour"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfilePicture;
