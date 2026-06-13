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
const LoginRequiredDialog = ({
  open,
  onClose,
  message = "You must be logged in to perform this action.",
}) => {
  const { handleGoogleLogin } = useContext(AuthContext);
  const theme = useTheme();

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
          py: 2,
        }}
      >
        <DialogTitle sx={{ textAlign: "center", m: 0, fontSize: "1.5rem" }}>
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
          <GoogleLoginButton />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;
