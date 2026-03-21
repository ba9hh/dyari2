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
        sx={{
          mb: 0,
          px: 2,
          "& .MuiTabs-indicator": {
            backgroundColor: "#d97706",
            height: "4px",
          },
        }}
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
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#d97706",
            },
          }}
        />
        <Tab
          label="Orders"
          value="orders"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#d97706",
            },
          }}
        />
        <Tab
          label="Contact"
          value="contact"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#d97706",
            },
          }}
        />
      </Tabs>
    </Box>
  );
};

export default ShopTabs;
