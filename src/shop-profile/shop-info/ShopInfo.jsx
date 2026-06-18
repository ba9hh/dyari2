import EditIcon from "@mui/icons-material/Edit";
import pdp from "@/assets/pdp.png";

const ShopInfo = ({ shop, onEdit }) => {
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
            className="w-full h-full border-2 p-1 rounded-full bg-white object-cover"
            src={shop?.profile_picture || pdp}
            alt="Profile"
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-xl mt-1">{shop?.business_name}</h1>
          <p className="text-sm text-gray-700 text-center mb-1.5 pb-1.5 border-b border-gray-100 px-6 max-w-md leading-relaxed italic">
            Bio: Made with love
          </p>
          <div className="flex gap-1.5">
            <h1 className="text-sm">Specialité: {shop?.category}</h1>
            <h1 className="text-sm">|</h1>
            <h1 className="text-sm">Localisation: {shop?.address}</h1>
            <h1 className="text-sm">|</h1>
            <h1 className="text-sm">Téléphone: 27428425</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
