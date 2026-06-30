import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { fetchUserInformation } from "@/services/users/UserInformation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";

const UserHeader = ({ userId }) => {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserInformation(userId),
  });

  const updateRole = async (newRole) => {
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating role:", error);
    } else {
      window.location.reload();
    }
  };

  const handleBecomeVendeur = async () => {
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("user_id", user.id)
      .single();
    console.log(data);

    if (data) {
      await updateRole("vendeur");
    } else {
      navigate("/shop-creation");
    }
  };
  return (
    <>
      <div className="hidden sm:flex gap-2 justify-end items-center p-2">
        <Button
          onClick={handleBecomeVendeur}
          variant="outlined"
          color="primary"
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
          Devenir vendeur
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            backgroundColor: "#d97706",
            "&:hover": {
              backgroundColor: "#b45309",
            },
          }}
          component={Link}
          to="settings"
        >
          Paramètres
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            backgroundColor: "#d97706",
            "&:hover": {
              backgroundColor: "#b45309",
            },
          }}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </div>
      <div className="flex sm:hidden gap-2 justify-between items-center p-2">
        <Button
          onClick={handleBecomeVendeur}
          variant="outlined"
          color="primary"
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
          Devenir vendeur
        </Button>
        <div className="flex gap-2 items-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              textTransform: "none",
              backgroundColor: "#d97706",
              "&:hover": {
                backgroundColor: "#b45309",
              },
            }}
            component={Link}
            to="settings"
          >
            Paramètres
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              textTransform: "none",
              backgroundColor: "#d97706",
              "&:hover": {
                backgroundColor: "#b45309",
              },
            }}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserHeader;
