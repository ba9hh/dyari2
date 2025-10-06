import { supabase } from "../../supabaseClient";

export const fetchShopOrders = async ({ queryKey }) => {
  const [_key, { shopId, page, limit }] = queryKey;

  const start = (page - 1) * limit;
  const end = page * limit - 1;

  const { data, count, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        quantity,
        articles (
          article_image,
          article_price,
          article_type
        )
      ),
      users (
        name
      )
      `,
      { count: "exact" } // count total rows
    )
    .eq("shop_id", shopId)
    .order("order_date", { ascending: false }) // optional sorting
    .range(start, end);

  if (error) throw error;

  return {
    orders: data,
    totalPages: Math.ceil(count / limit),
  };
};

export const fetchUserOrders = async ({ queryKey }) => {
  const [_key, { userId, page, limit }] = queryKey;

  const start = (page - 1) * limit;
  const end = page * limit - 1;

  const { data, count, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        quantity,
        articles (
          article_image,
          article_price,
          article_type
        )
      ),
      shops (
        name,
        last_name
      )
      `,
      { count: "exact" } // <-- get total count
    )
    .eq("user_id", userId)
    .order("order_date", { ascending: false }) // optional
    .range(start, end);

  if (error) throw error;

  return {
    orders: data,
    totalPages: Math.ceil(count / limit),
  };
};
