import { useState, useEffect, useContext } from "react";
import pdp from "@/assets/pdp.png";
import { Tabs, Tab, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserProfilePicture from "./UserProfilePicture";
import { fetchUserInformation } from "@/services/users/UserInformation";
import { useQuery } from "@tanstack/react-query";
import UserInfoSkeleton from "@/skeleton/user-profile/UserInfoSkeleton";
import UserProfile from "./UserProfile";
import UserHeader from "./UserHeader";
const UserInfo = ({ userId, activeTab, handleChange }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", userId], // unique query key
    queryFn: () => fetchUserInformation(userId),
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  if (isLoading) return <UserInfoSkeleton />;
  return (
    <div className="relative w-full sm:w-2/3 bg-white shadow-sm rounded-md border border-t-0 sm:border-t">
      <UserHeader userId={userId} />
      <hr />
      <UserProfile user={user} handleOpen={handleOpen} />
      <Box sx={{ borderTop: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          centered
          sx={{
            mb: 0,
            px: 2,
            "& .MuiTabs-indicator": {
              backgroundColor: "#d97706",
              height: "3px",
            },
          }}
        >
          <Tab
            label="Commandes"
            value="orders"
            sx={{
              textTransform: "none",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: "bold",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "#d97706",
              },
            }}
          />
          <Tab
            label="Enregistrés"
            value="likedShops"
            sx={{
              textTransform: "none",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: "bold",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "#d97706",
              },
            }}
          />
          <Tab
            label="Avis laissés"
            value="ratedShops"
            sx={{
              textTransform: "none",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: "bold",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "#d97706",
              },
            }}
          />
        </Tabs>
      </Box>
      <UserProfilePicture
        open={open}
        setOpen={setOpen}
        user={user}
        file={file}
        setFile={setFile}
        preview={preview}
        setPreview={setPreview}
        userId={userId}
      />
    </div>
  );
};

export default UserInfo;
