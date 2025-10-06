import { supabase } from "../../supabaseClient";

export const fetchShops = async ({ queryKey }) => {
  const [_key, { type, localisation, page, shopId, limit }] = queryKey;

  let query = supabase
    .from("shops")
    .select(
      `
      *,
      articles (
        article_image
      )
      `,
      { count: "exact" }
    )
    .range((page - 1) * limit, page * limit - 1);

  if (type) query = query.contains("speciality", [type]);
  if (localisation && localisation !== "Toute la Tunisie") {
    query = query.eq("localisation", localisation);
  }
  if (shopId) {
    query = query.neq("id", shopId);
  }

  const { data, count, error } = await query;

  if (error) throw error;
  const shopsWithImages = data.map((shop) => ({
    ...shop,
    articles: shop.articles ? shop.articles.slice(0, 3) : [],
  }));
  return {
    shops: shopsWithImages,
    totalPages: Math.ceil(count / limit),
  };
};
