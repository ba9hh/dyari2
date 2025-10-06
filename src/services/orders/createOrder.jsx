import { supabase } from "../../supabaseClient";

export async function createOrder({
  shopId,
  userId,
  phoneNumber,
  neededDate,
  items,
}) {
  const orderTotalAmount = items.reduce(
    (sum, itm) => sum + itm.price * itm.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        shop_id: shopId,
        user_id: userId,
        user_phone_number: phoneNumber,
        user_needed_date: neededDate,
        order_total_amount: orderTotalAmount,
      },
    ])
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    article_id: item.articleId,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}
