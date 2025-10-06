import { supabase } from "../../supabaseClient";
export const getLikedShops = async (userId) => {
  const { data, error } = await supabase
    .from("shops")
    .select("*, liked_shop!inner(user_id)")
    .eq("liked_shop.user_id", userId);

  if (error) throw error;
  return data;
};
export const isShopLiked = async (userId, shopId) => {
  const { data, error } = await supabase
    .from("liked_shop")
    .select("*")
    .eq("user_id", userId)
    .eq("shop_id", shopId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

export const likeShop = async (userId, shopId) => {
  const { data, error } = await supabase
    .from("liked_shop")
    .insert([{ user_id: userId, shop_id: shopId }]);

  if (error) throw error;
  return data;
};
export const unlikeShop = async (userId, shopId) => {
  const { data, error } = await supabase
    .from("liked_shop")
    .delete()
    .match({ user_id: userId, shop_id: shopId });

  if (error) throw error;
  return data;
};
