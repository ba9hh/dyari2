import { useState, useContext } from "react";
import { AuthContext } from "../../../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { fetchShopInformation } from "../../../services/shops/ShopInformation";
import SkeletonInformationShop from "../../../skeleton/shop/SkeletonInformationShop";
import ShopTabs from "../../../components/tabs/ShopTabs";
import ShopHeader from "./ShopHeader";
import ShopProfile from "./ShopProfile";
import ProfilePictureDialog from "./ProfilePictureDialog";
const InformationShop = ({ shopId, activeTab, handleChange }) => {
  const { handleLogout } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    data: shop,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["shop", shopId], // unique query key
    queryFn: () => fetchShopInformation(shopId),
  });
  if (isLoading) {
    return <SkeletonInformationShop />;
  }
  return (
    <div className="relative w-full sm:w-2/3 bg-white shadow-md rounded-md">
      <ShopHeader handleLogout={handleLogout} />

      {/* <div className="absolute top-0 left-0 flex items-center px-1">
          <h1>{user?.averageRating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={user?.averageRating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({user?.totalRating})</h1>
        </div> */}

      <div className="h-28 bg-gradient-to-t from-gray-300 to-transparent flex justify-center items-center"></div>
      <ShopProfile shop={shop} onEdit={() => setOpen(true)} />
      <ShopTabs activeTab={activeTab} handleChange={handleChange} />
      <ProfilePictureDialog
        open={open}
        setOpen={setOpen}
        shop={shop}
        file={file}
        setFile={setFile}
        preview={preview}
        setPreview={setPreview}
        shopId={shopId}
      />
    </div>
  );
};

export default InformationShop;
