import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ShopHeader = ({ handleLogout }) => {
  return (
    <>
      <div className="flex justify-end gap-2 p-2">
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ textTransform: "none" }}
          component={Link}
          to="settings"
        >
          Settings
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ textTransform: "none" }}
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
