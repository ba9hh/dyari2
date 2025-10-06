import { useContext, useState } from "react";
import GeneralAboutShop from "./GeneralAboutShop";
import DeleteShop from "./DeleteShop";
import { AuthContext } from "../../AuthProvider";
import DyariLogo from "../../components/DyariLogo";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AboutShop = ({ shopId }) => {
  const { user } = useContext(AuthContext);
  console.log(shopId);
  return (
    <div className="min-h-screen flex justify-center pt-16 pb-8 sm:bg-[#F5F5F5] bg-white ">
      <DyariLogo />
      <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md py-2 sm:py-8">
        <GeneralAboutShop shopId={user.id} />
        <div className="mt-4 px-6">
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            sx={{
              py: 2,
              color: "grey.800",
            }}
          >
            Update password
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            component={Link}
            to="change-password"
          >
            update password
          </Button>
        </div>
        <DeleteShop shopId={user.id} />
      </div>
    </div>
  );
};

export default AboutShop;
