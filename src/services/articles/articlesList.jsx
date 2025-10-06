import { supabase } from "../../supabaseClient";

export const fetchShopArticles = async ({ queryKey }) => {
  const [_key, { shopId, page, limit }] = queryKey;

  const start = (page - 1) * limit;
  const end = page * limit - 1;

  const { data, count, error } = await supabase
    .from("articles")
    .select("*", { count: "exact" }) // count total rows
    .eq("shop_id", shopId)
    .range(start, end);

  if (error) throw error;

  return {
    articles: data,
    totalPages: Math.ceil(count / limit),
  };
};
