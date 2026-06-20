import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const OrderBreadCrumbs = () => {
  return (
    <div className="py-2 mb-1">
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.75rem" }}>
        <Link underline="hover" color="inherit" href="/" sx={{ fontSize: "0.75rem" }}>
          Accueil
        </Link>
        <Link underline="hover" color="inherit" href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }} sx={{ fontSize: "0.75rem" }}>
          Boutique
        </Link>
        <Typography sx={{ color: "text.primary", fontSize: "0.75rem" }}>
          Commande
        </Typography>
      </Breadcrumbs>
    </div>
  );
};

export default OrderBreadCrumbs;
