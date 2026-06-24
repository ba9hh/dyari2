import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

// ─── helpers ────────────────────────────────────────────────────────────────

const fetchProfile = async (userId, role) => {
  if (role === "vendeur") {
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

// ─── section wrapper ─────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
      <Icon sx={{ fontSize: 20, color: "#d97706" }} />
      <span className="font-semibold text-gray-800 text-sm">{title}</span>
    </div>
    <div className="px-5 py-5 flex flex-col gap-4">{children}</div>
  </div>
);

// ─── amber text field ────────────────────────────────────────────────────────

const AmberField = ({ label, ...props }) => (
  <TextField
    label={label}
    size="small"
    fullWidth
    variant="outlined"
    sx={{
      "& label.Mui-focused": { color: "#d97706" },
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": { borderColor: "#d97706" },
      },
    }}
    {...props}
  />
);

// ─── main component ──────────────────────────────────────────────────────────

const AccountSettings = () => {
  const { user: authUser, handleLogout } = useContext(AuthContext);
  const isOAuthUser =
    authUser?.app_metadata?.provider === "google" ||
    (authUser?.app_metadata?.providers ?? []).includes("google");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const role = authUser?.role ?? "client";
  const userId = authUser?.id;

  // fetch profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["settings-profile", userId, role],
    queryFn: () => fetchProfile(userId, role),
    enabled: !!userId,
  });

  // ── client fields
  const [fullName, setFullName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  // ── shop fields
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("");

  // ── password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── ui state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState(false);

  // seed local state once profile loads
  useEffect(() => {
    if (!profile) return;
    if (role === "vendeur") {
      setBusinessName(profile.business_name ?? "");
      setBio(profile.bio ?? "");
      setAddress(profile.address ?? "");
      setPhoneNumber(profile.phone_number ?? "");
      setCategory(profile.category ?? "");
    } else {
      setFullName(profile.full_name ?? "");
      setClientEmail(profile.email ?? "");
    }
  }, [profile]);

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  // ── save profile mutation
  const saveProfile = useMutation({
    mutationFn: async () => {
      if (role === "vendeur") {
        const { error } = await supabase
          .from("shops")
          .update({
            business_name: businessName,
            bio,
            address,
            phone_number: phoneNumber,
            category,
          })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("users")
          .update({ full_name: fullName })
          .eq("id", userId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["settings-profile", userId, role]);
      queryClient.invalidateQueries(["shop", userId]);
      queryClient.invalidateQueries(["user", userId]);
      showToast("Modifications enregistrées.");
    },
    onError: (e) => showToast(e.message, "error"),
  });

  // ── change password mutation
  const changePassword = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword)
        throw new Error("Les mots de passe ne correspondent pas.");
      if (newPassword.length < 6)
        throw new Error(
          "Le mot de passe doit comporter au moins 6 caractères.",
        );
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Mot de passe mis à jour.");
    },
    onError: (e) => showToast(e.message, "error"),
  });

  // ── delete account mutation
  const deleteAccount = useMutation({
    mutationFn: async () => {
      // Deleting the users row triggers the cascade to auth.users via the DB trigger
      const { error } = await supabase.from("users").delete().eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      handleLogout();
    },
    onError: (e) => showToast(e.message, "error"),
  });

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress sx={{ color: "#d97706" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 20, color: "#374151" }} />
          </button>
          <span className="font-semibold text-gray-800">Paramètres</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 flex flex-col gap-5">
        {/* ── profile section ── */}
        {role === "vendeur" ? (
          <Section icon={StoreOutlinedIcon} title="Informations de la boutique">
            <AmberField
              label="Nom de la boutique"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <AmberField
              label="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <AmberField
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <AmberField
              label="Numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <AmberField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              multiline
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                variant="contained"
                onClick={() => saveProfile.mutate()}
                disabled={saveProfile.isPending}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#d97706",
                  "&:hover": { backgroundColor: "#b45309" },
                  minWidth: 140,
                }}
              >
                {saveProfile.isPending ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </Section>
        ) : (
          <Section icon={PersonOutlineIcon} title="Informations personnelles">
            <AmberField
              label="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <AmberField
              label="Email"
              value={clientEmail}
              disabled
              helperText="L'email ne peut pas être modifié ici."
            />
            <div className="flex justify-end">
              <Button
                variant="contained"
                onClick={() => saveProfile.mutate()}
                disabled={saveProfile.isPending}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#d97706",
                  "&:hover": { backgroundColor: "#b45309" },
                  minWidth: 140,
                }}
              >
                {saveProfile.isPending ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </Section>
        )}

        {/* ── password section ── */}
        {!isOAuthUser && (
          <Section icon={LockOutlinedIcon} title="Changer le mot de passe">
            <AmberField
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <AmberField
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && newPassword !== confirmPassword}
              helperText={
                confirmPassword && newPassword !== confirmPassword
                  ? "Les mots de passe ne correspondent pas."
                  : ""
              }
            />
            <div className="flex justify-end">
              <Button
                variant="contained"
                onClick={() => changePassword.mutate()}
                disabled={
                  changePassword.isPending || !newPassword || !confirmPassword
                }
                sx={{
                  textTransform: "none",
                  backgroundColor: "#d97706",
                  "&:hover": { backgroundColor: "#b45309" },
                  minWidth: 140,
                }}
              >
                {changePassword.isPending ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </div>
          </Section>
        )}
        {/* ── danger zone ── */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-red-100">
            <DeleteOutlineIcon sx={{ fontSize: 20, color: "#ef4444" }} />
            <span className="font-semibold text-red-600 text-sm">
              Zone de danger
            </span>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm text-gray-500 mb-4">
              La suppression de votre compte est définitive. Toutes vos données
              seront effacées et cette action ne peut pas être annulée.
            </p>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setDeleteDialog(true)}
              sx={{
                textTransform: "none",
                color: "#ef4444",
                borderColor: "#ef4444",
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "rgba(239,68,68,0.04)",
                },
              }}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>

      {/* ── delete confirm dialog ── */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Supprimer le compte ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cette action est irréversible. Toutes vos données seront supprimées
            définitivement.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              setDeleteDialog(false);
              deleteAccount.mutate();
            }}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#ef4444",
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── toast ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AccountSettings;
