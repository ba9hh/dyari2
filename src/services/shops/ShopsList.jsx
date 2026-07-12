import { supabase } from "@/supabaseClient";

export const fetchShops = async ({ queryKey }) => {
  const [_key, { type, localisation, page, limit, search, userId }] = queryKey;

  const { data, error } = await supabase.rpc("get_best_shops", {
    p_category: type || null,
    p_localisation:
      localisation && localisation !== "Toute la Tunisie" ? localisation : null,
    p_search: search || null,
    p_exclude_user_id: userId || null,
    p_limit: limit,
    p_offset: (page - 1) * limit,
  });

  if (error) throw error;

  const totalCount = data?.[0]?.total_count ?? 0;

  const shopsWithImages = data.map((shop) => ({
    ...shop,
    articles: (shop.article_images || []).map((img) => ({
      article_image: img,
    })),
  }));

  return {
    shops: shopsWithImages,
    totalPages: Math.ceil(totalCount / limit),
  };
};
