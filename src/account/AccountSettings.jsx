import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
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

// ─── helpers ─────────────────────────────────────────────────────────────────

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

// ─── section wrapper ──────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
      <Icon sx={{ fontSize: 20, color: "#d97706" }} />
      <span className="font-semibold text-gray-800 text-sm">{title}</span>
    </div>
    <div className="px-5 py-5 flex flex-col gap-4">{children}</div>
  </div>
);

// ─── amber text field ─────────────────────────────────────────────────────────

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

// ─── main component ───────────────────────────────────────────────────────────

const Settings = () => {
  const { user: authUser, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const role = authUser?.role ?? "client";
  const userId = authUser?.id;
  const isOAuthUser =
    authUser?.app_metadata?.provider === "google" ||
    (authUser?.app_metadata?.providers ?? []).includes("google");

  // ── fetch profile
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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── validation errors
  const [errors, setErrors] = useState({});

  // ── ui state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState(false);

  // ── seed fields once profile loads
  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setClientEmail(profile.email ?? "");
    setBusinessName(profile.business_name ?? "");
    setBio(profile.bio ?? "");
    setAddress(profile.address ?? "");
    setPhoneNumber(profile.phone_number ?? "");
    setCategory(profile.category ?? "");
  }, [profile]);

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  // ── validation
  const validateProfile = () => {
    const newErrors = {};
    if (role === "vendeur") {
      if (!businessName.trim())
        newErrors.businessName = "Nom de la boutique requis";
      if (!category.trim()) newErrors.category = "Catégorie requise";
      if (!address.trim()) newErrors.address = "Adresse requise";
      if (phoneNumber && !/^[2459]\d{7}$/.test(phoneNumber))
        newErrors.phoneNumber = "Numéro invalide (ex: 20123456)";
    } else {
      if (!fullName.trim()) newErrors.fullName = "Nom complet requis";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = "Veuillez entrer un mot de passe";
    else if (newPassword.length < 6)
      newErrors.newPassword = "Minimum 6 caractères";
    if (!confirmPassword)
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

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
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      showToast("Mot de passe mis à jour.");
    },
    onError: (e) => showToast(e.message, "error"),
  });

  // ── delete account mutation
  const deleteAccount = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("users").delete().eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => handleLogout(),
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
              onChange={(e) => {
                setBusinessName(e.target.value);
                clearError("businessName");
              }}
              error={!!errors.businessName}
              helperText={errors.businessName}
            />
            <AmberField
              label="Catégorie"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                clearError("category");
              }}
              error={!!errors.category}
              helperText={errors.category}
            />
            <AmberField
              label="Adresse"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                clearError("address");
              }}
              error={!!errors.address}
              helperText={errors.address}
            />
            <AmberField
              label="Numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                clearError("phoneNumber");
              }}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber || "Ex: 20123456"}
              inputProps={{ maxLength: 8 }}
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
                onClick={() => {
                  if (validateProfile()) saveProfile.mutate();
                }}
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
              onChange={(e) => {
                setFullName(e.target.value);
                clearError("fullName");
              }}
              error={!!errors.fullName}
              helperText={errors.fullName}
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
                onClick={() => {
                  if (validateProfile()) saveProfile.mutate();
                }}
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
        {isOAuthUser ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-2 text-sm text-gray-400">
            <LockOutlinedIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
            Vous êtes connecté via Google — la gestion du mot de passe se fait
            depuis votre compte Google.
          </div>
        ) : (
          <Section icon={LockOutlinedIcon} title="Changer le mot de passe">
            <AmberField
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearError("newPassword");
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
            <AmberField
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError("confirmPassword");
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <div className="flex justify-end">
              <Button
                variant="contained"
                onClick={() => {
                  if (validatePassword()) changePassword.mutate();
                }}
                disabled={changePassword.isPending}
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

export default Settings;
