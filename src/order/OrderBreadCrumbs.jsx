import React from "react";
import { Typography, Breadcrumbs, Link } from "@mui/material";

const OrderBreadCrumbs = () => {
  return (
    <div className="sm:hidden py-2">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Shop
        </Link>
        <Typography sx={{ color: "text.primary" }}>Commande</Typography>
      </Breadcrumbs>
    </div>
  );
};

export default OrderBreadCrumbs;
