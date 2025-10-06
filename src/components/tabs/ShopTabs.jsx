import React from "react";
import { Tab, Tabs, Box } from "@mui/material";

const ShopTabs = ({ activeTab, handleChange }) => {
  return (
    <Box sx={{ borderTop: 1, borderColor: "divider", width: "100%" }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="standard"
        sx={{ mb: 0, px: 2 }}
        TabIndicatorProps={{
          style: {
            height: "4px",
          },
        }}
        centered
      >
        <Tab
          label="Articles"
          value="articles"
          sx={{ textTransform: "none", fontWeight: "bold" }}
        />
        <Tab
          label="Orders"
          value="orders"
          sx={{ textTransform: "none", fontWeight: "bold" }}
        />
        <Tab
          label="Contact"
          value="contact"
          sx={{ textTransform: "none", fontWeight: "bold" }}
        />
      </Tabs>
    </Box>
  );
};

export default ShopTabs;
