import { Tabs, Tab, Box } from "@mui/material";

export default function OrdersTabs({ selectedFilter, setSelectedFilter }) {
  const handleChange = (event, newValue) => {
    setSelectedFilter(newValue);
  };
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={selectedFilter}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 1,
          px: 1,
          "& .MuiTabs-indicator": {
            backgroundColor: "#d97706",
          },
        }}
      >
        <Tab
          label="Toutes les commandes"
          value="all"
          sx={{
            textTransform: "none",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#d97706",
            },
          }}
        />
        <Tab
          label="Commandes en attente"
          value="pending"
          sx={{
            textTransform: "none",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#d97706",
            },
          }}
        />
        <Tab
          label="Commandes acceptées"
          value="accepted"
          sx={{
            textTransform: "none",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#d97706",
            },
          }}
        />
        <Tab
          label="Commandes annulées"
          value="rejected"
          sx={{
            textTransform: "none",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#d97706",
            },
          }}
        />
      </Tabs>
    </Box>
  );
}
