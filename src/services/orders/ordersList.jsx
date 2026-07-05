import { supabase } from "@/supabaseClient";

export const fetchShopOrders = async ({ queryKey }) => {
  const [_key, { shopId, page, limit, filter }] = queryKey;

  const start = (page - 1) * limit;
  const end = page * limit - 1;

  let query = supabase
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
        full_name
      )
      `,
      { count: "exact" }, // count total rows
    )
    .eq("shop_id", shopId);

  if (filter && filter !== "all") {
    query = query.eq("order_state", filter);
  }

  const { data, count, error } = await query
    .order("order_date", { ascending: false }) // optional sorting
    .range(start, end);

  if (error) throw error;

  return {
    orders: data,
    totalPages: Math.ceil(count / limit),
    totalOrders: count,
  };
};

export const fetchUserOrders = async ({ queryKey }) => {
  const [_key, { userId, page, limit, filter }] = queryKey;

  const start = (page - 1) * limit;
  const end = page * limit - 1;

  let query = supabase
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
        id,
        business_name
      )
      `,
      { count: "exact" }, // <-- get total count
    )
    .eq("user_id", userId);

  if (filter && filter !== "all") {
    query = query.eq("order_state", filter);
  }

  const { data, count, error } = await query
    .order("order_date", { ascending: false }) // optional
    .range(start, end);

  if (error) throw error;

  return {
    orders: data,
    totalPages: Math.ceil(count / limit),
    totalOrders: count,
  };
};

export const markOrderAsRead = async (orderId) => {
  const { error } = await supabase
    .from("orders")
    .update({ is_read: true })
    .eq("id", orderId)
    .eq("is_read", false); // only update if not already read (avoids unnecessary writes)

  if (error) throw error;
};
