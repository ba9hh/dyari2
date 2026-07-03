import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ShopHeader = ({ handleLogout, handleBecomeClient }) => {
  return (
    <div className="w-full sm:w-fit flex justify-between sm:justify-normal gap-2">
      <Button
        onClick={handleBecomeClient}
        variant="outlined"
        color="primary"
        sx={{
          textTransform: "none",
          // fontSize: { xs: "0.75rem" },
          // fontSize: "0.75rem",
          color: "#d97706",
          borderColor: "#d97706",
          "&:hover": {
            borderColor: "#b45309",
            backgroundColor: "rgba(217, 119, 6, 0.04)",
          },
        }}
      >
        Devenir client
      </Button>
      <div className="flex gap-2">
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            // fontSize: { xs: "0.75rem" },
            // fontSize: "0.75rem",
            backgroundColor: "#d97706",
            "&:hover": {
              backgroundColor: "#b45309",
            },
          }}
          component={Link}
          to="parametres"
        >
          Paramètres
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            // fontSize: "0.75rem",
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
  );
};

export default ShopHeader;
