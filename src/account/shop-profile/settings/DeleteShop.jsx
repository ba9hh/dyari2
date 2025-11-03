import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
const DeleteShop = ({ shopId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("shops").delete().eq("id", shopId);
      if (error) throw error;
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <div className="mt-4 px-6">
      <Typography
        variant="body1"
        align="center"
        sx={{
          py: 2,
          color: "grey.800",
        }}
      >
        Delete account
      </Typography>
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => setOpen(true)}
      >
        Delete Account
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteShop;
