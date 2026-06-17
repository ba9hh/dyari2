import { supabase } from "@/supabaseClient";

// Get all shops rated by a user (with the rating)
export const fetchRatedShops = async (userId) => {
  const { data, error } = await supabase
    .from("shops")
    .select("*, reviews!inner(rating, comment_text, created_at)")
    .eq("reviews.user_id", userId);

  if (error) throw error;

  return data.map((shop) => ({
    ...shop,
    userReview: shop.reviews[0] ?? null, // user's review for this shop
  }));
};
