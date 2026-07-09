import EditIcon from "@mui/icons-material/Edit";

const ShopInfo = ({ shop, onEdit }) => {
  const DEFAULT_PROFILE_PICTURE =
    "https://obhlpgxxiotewfhcvdaw.supabase.co/storage/v1/object/public/images/1753197818753-icon-7797704_640.png";
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-1 mb-4 mt-4">
        <div className="relative inline-block group w-16 h-16">
          <button
            type="button"
            onClick={onEdit}
            className="absolute bottom-0 -right-2 hover:bg-gray-100 bg-white rounded-full px-1 pb-1 shadow-md"
          >
            <EditIcon sx={{ fontSize: 18, color: "#4B5563" }} />
          </button>
          <img
            className="w-full h-full border-2 p-0.5 rounded-full bg-white object-cover"
            src={shop?.profile_picture || DEFAULT_PROFILE_PICTURE}
            alt="Profile"
          />
        </div>
        <h1 className="text-lg sm:text-xl font-medium mt-1 text-gray-800">
          {shop?.business_name}
        </h1>
        <p className="text-sm text-gray-500 italic text-center border-b border-gray-100 pb-2 px-6 max-w-xs">
          {shop?.bio}
        </p>
        {/* Info pills — stack on mobile, row on desktop */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-sm sm:text-sm text-gray-600 text-center">
          <span>
            <span className="font-medium text-gray-700">Spécialité:</span>{" "}
            {shop?.category}
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>
            <span className="font-medium text-gray-700">Localisation:</span>{" "}
            {shop?.address}
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>
            <span className="font-medium text-gray-700">Tél:</span>{" "}
            {shop?.phone_number}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
