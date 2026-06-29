import { useState, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { fetchShopInformation } from "@/services/shops/ShopInformation";
import SkeletonShopInfo from "@/skeleton/shop/SkeletonShopInfo";
import ShopTabs from "./ShopTabs";
import ShopHeader from "./ShopHeader";
import ShopInfo from "./ShopInfo";
import ProfilePictureDialog from "./ProfilePictureDialog";
import ReactStars from "react-rating-stars-component";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
const ShopProfile = ({ shopId, activeTab, handleChange }) => {
  const { user } = useContext(AuthContext);
  const { handleLogout } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    data: shop,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["shop", shopId], // unique query key
    queryFn: () => fetchShopInformation(shopId),
  });
  if (isLoading) {
    return <SkeletonShopInfo />;
  }
  const updateRole = async (newRole) => {
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating role:", error);
    } else {
      window.location.reload();
    }
  };
  const handleBecomeClient = async () => {
    await updateRole("client");
  };
  return (
    <div className="relative w-full sm:w-2/3 bg-white shadow-sm rounded-md border border-t-0 sm:border-t">
      <div className="flex sm:justify-between items-center px-3 py-2">
        <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-sm font-semibold rounded-full py-1 px-2.5 border bg-amber-50 text-amber-600 border-amber-200">
          <span>{shop?.average_rating}</span>
          <ReactStars
            count={5}
            size={16}
            value={shop?.average_rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#d97706"
          />
          <span className="text-gray-400 text-xs">({shop?.total_rating})</span>
        </div>
        <ShopHeader
          handleLogout={handleLogout}
          handleBecomeClient={handleBecomeClient}
        />
      </div>
      <hr />
      <ShopInfo shop={shop} onEdit={() => setOpen(true)} />
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

export default ShopProfile;
