import EditIcon from "@mui/icons-material/Edit";

const UserProfile = ({ user, handleOpen }) => {
  const DEFAULT_PROFILE_PICTURE =
    "https://obhlpgxxiotewfhcvdaw.supabase.co/storage/v1/object/public/images/1753197818753-icon-7797704_640.png";
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-1 my-4">
        <div className="relative inline-block group w-16 h-16">
          <button
            type="button"
            onClick={handleOpen}
            className="absolute bottom-0 -right-2 hover:bg-gray-100 bg-white rounded-full px-1 pb-1 shadow-md transition-opacity focus:outline-none"
          >
            <EditIcon sx={{ fontSize: 18, color: "#4B5563" }} />
          </button>
          <img
            className="w-full h-full border-2 p-0.5 rounded-full bg-white object-cover"
            src={user ? user.avatar_url : DEFAULT_PROFILE_PICTURE}
            alt="Profile"
          />
        </div>
        <div className="flex flex-col items-center  mt-1">
          <h1 className="text-lg sm:text-xl font-medium text-gray-800">
            {user ? user.full_name : ""}
          </h1>
          <h1 className="text-sm text-gray-400">{user ? user.email : ""}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
