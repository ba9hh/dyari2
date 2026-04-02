import { supabase } from "@/supabaseClient";
export const fetchShopInformation = async (shopId) => {
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("user_id", shopId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};
