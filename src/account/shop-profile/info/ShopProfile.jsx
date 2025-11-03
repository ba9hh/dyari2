import EditIcon from "@mui/icons-material/Edit";
import pdp from "../../../assets/pdp.png";

const ShopProfile = ({ shop, onEdit }) => {
  return (
    <div className="flex justify-center -mt-6">
      <div className="flex flex-col items-center gap-1 mb-4">
        <div className="relative inline-block group w-20 h-20">
          <button
            type="button"
            onClick={onEdit}
            className="absolute bottom-0 -right-2 hover:bg-gray-100 bg-white rounded-full px-1 pb-1 shadow-md"
          >
            <EditIcon sx={{ fontSize: 18, color: "#4B5563" }} />
          </button>
          <img
            className="w-full h-full border-2 p-1 rounded-full bg-white object-cover"
            src={shop?.profile_picture || pdp}
            alt="Profile"
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-lg">{shop?.name}</h1>
          <h1 className="text-sm text-gray-400">{shop?.email}</h1>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
