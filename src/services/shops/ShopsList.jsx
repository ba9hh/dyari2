import { supabase } from "@/supabaseClient";

export const fetchShops = async ({ queryKey }) => {
  const [_key, { type, localisation, page, limit, search, userId }] = queryKey;

  let query = supabase
    .from("shops")
    .select(
      `
      *,
      articles (
        article_image
      )
      `,
      { count: "exact" },
    )
    .gt("number_of_articles", 0)
    .range((page - 1) * limit, page * limit - 1);

  if (type) query = query.eq("category", type);
  if (localisation && localisation !== "Toute la Tunisie") {
    query = query.eq("address", localisation);
  }
  if (userId) query = query.neq("user_id", userId);
  if (search) query = query.ilike("business_name", `%${search}%`);

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
