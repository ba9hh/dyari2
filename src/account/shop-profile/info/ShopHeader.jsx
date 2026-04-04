import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ShopHeader = ({ handleLogout }) => {
  return (
    <>
      <div className="flex justify-end gap-2 p-2">
        <Button
          // onClick={handleBecomeClient}
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
          Devenir client
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
          Settings
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
          Logout
        </Button>
      </div>
      <hr />
    </>
  );
};

export default ShopHeader;
