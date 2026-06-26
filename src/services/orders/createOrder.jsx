import { supabase } from "@/supabaseClient";

export async function createOrder({
  shopId,
  userId,
  phoneNumber,
  neededDate,
  items,
  deliveryType,
}) {
  const orderTotalAmount = items.reduce(
    (sum, itm) => sum + itm.price * itm.quantity,
    0,
  );

  const { data, error } = await supabase.rpc("create_order_with_items", {
    p_shop_id: shopId,
    p_user_id: userId,
    p_user_phone_number: phoneNumber,
    p_user_needed_date: neededDate,
    p_order_total_amount: orderTotalAmount,
    p_delivery_type: deliveryType,
    p_items: items.map((item) => ({
      article_id: item.articleId,
      quantity: item.quantity,
    })),
  });

  if (error) throw new Error(error.message);

  return data;
}
