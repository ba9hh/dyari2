import { useState, useEffect } from "react";
import { Typography, TextField, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../../../supabaseClient";
import fieldConfig from "../../../data/fieldConfig";

const ContactShop = ({ shopId }) => {
  const [values, setValues] = useState(
    Object.fromEntries(Object.keys(fieldConfig).map((f) => [f, ""]))
  );
  const [original, setOriginal] = useState({ ...values });
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInfo = async () => {
      const { data, error } = await supabase
        .from("shop_additional_info")
        .select("*")
        .eq("shop_id", shopId)
        .single();

      if (error && error.code !== "PGRST116") {
        // ignore "no rows" error
        console.error(error);
        return;
      }

      const info = data || {};
      const newVals = { ...values };
      Object.keys(fieldConfig).forEach((f) => {
        newVals[f] = info[f] || "";
      });
      setValues(newVals);
      setOriginal(newVals);
    };

    if (shopId) fetchInfo();
  }, [shopId]);

  const handleChange = (field) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [field]: v }));
    // re-validate on change
    const ok = fieldConfig[field].validate(v);
    setErrors((prev) => ({
      ...prev,
      [field]: ok ? "" : fieldConfig[field].helperText,
    }));
  };

  const saveField = async (field) => {
    try {
      const updatePayload = { [field]: values[field] };

      const { error } = await supabase
        .from("shop_additional_info")
        .upsert(
          { shop_id: shopId, ...updatePayload },
          { onConflict: "shop_id" }
        );

      if (error) throw error;

      setOriginal((prev) => ({ ...prev, [field]: values[field] }));
      setEditing(null);
    } catch (err) {
      console.error("Failed to save field:", err);
      alert("Error saving the field. Please try again.");
    }
  };

  const deleteField = async (field) => {
    try {
      // Option 1: just null out the field
      const { error } = await supabase
        .from("shop_additional_info")
        .update({ [field]: null })
        .eq("shop_id", shopId);

      if (error) throw error;

      setValues((v) => ({ ...v, [field]: "" }));
      setOriginal((o) => ({ ...o, [field]: "" }));
    } catch (err) {
      console.error("Failed to delete field:", err);
      alert("Error deleting the field. Please try again.");
    }
  };

  const isUnchanged = (field) => values[field] === original[field];
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pt-4 pb-8 px-20">
      <Typography
        variant="body1"
        align="center"
        sx={{
          py: 2,
          color: "grey.800",
        }}
      >
        Contact (Facebook ,Whatsapp , ...)
      </Typography>
      <div className="space-y-6 mt-6 mb-2">
        {Object.entries(fieldConfig).map(([field, cfg]) => {
          const val = values[field];
          const hasOriginal = original[field]?.trim() !== "";
          const isEditing = editing === field;
          const errorMsg = errors[field] || "";
          const valid = !errorMsg && val.trim() !== "";

          return (
            <div key={field} className="flex items-center gap-2">
              <TextField
                label={cfg.label}
                value={val}
                onChange={handleChange(field)}
                disabled={!isEditing}
                error={!!errorMsg}
                helperText={errorMsg}
                fullWidth
              />

              {/* Delete button (only when not editing and a value exists) */}
              {!isEditing && hasOriginal && (
                <Tooltip title={`Delete ${cfg.label}`}>
                  <IconButton
                    onClick={() => deleteField(field)}
                    color="warning"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Edit / Save / Cancel */}
              {!isEditing ? (
                <IconButton onClick={() => setEditing(field)}>
                  <EditIcon />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    onClick={() => saveField(field)}
                    disabled={!valid || isUnchanged(field)}
                    color="primary"
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setValues((v) => ({
                        ...v,
                        [field]: original[field],
                      }));
                      setErrors((e) => ({ ...e, [field]: "" }));
                      setEditing(null);
                    }}
                    color="error"
                  >
                    <CancelIcon />
                  </IconButton>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactShop;
