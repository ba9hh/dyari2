import { supabase } from "../../supabaseClient";

// Get all shops rated by a user (with the rating)
export const fetchRatedShops = async (userId) => {
  const { data, error } = await supabase
    .from("shops")
    .select("*, ratings!inner(rating)")
    .eq("ratings.user_id", userId);

  if (error) throw error;

  // Map to attach the rating cleanly
  return data.map((shop) => ({
    ...shop,
    userRate: shop.ratings[0]?.rating ?? null, // user's rating for this shop
  }));
};
