import { useState, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { fetchShopInformation } from "@/services/shops/ShopInformation";
import SkeletonInformationShop from "@/skeleton/shop/SkeletonInformationShop";
import ShopTabs from "@/components/tabs/ShopTabs";
import ShopHeader from "./ShopHeader";
import ShopProfile from "./ShopProfile";
import ProfilePictureDialog from "./ProfilePictureDialog";
import ReactStars from "react-rating-stars-component";
const ShopInfo = ({ shopId, activeTab, handleChange }) => {
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
    <div className="relative w-full sm:w-2/3 bg-white shadow-md rounded-md border">
      <div className="flex justify-between items-center">
        <div className="flex items-center px-1">
          <h1>{shop?.average_rating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop?.average_rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({shop?.total_rating})</h1>
        </div>
        <ShopHeader handleLogout={handleLogout} />
      </div>
      <hr />
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

export default ShopInfo;
