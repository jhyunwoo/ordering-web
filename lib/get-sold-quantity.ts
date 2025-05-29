import db from "@/db";
import { and, eq, isNull } from "drizzle-orm";
import { menus, orders } from "@/db/schema";

export async function getSoldQuantity(menuId: number) {
  const orderData = await db.query.orders.findMany({
    where: and(isNull(orders.deletedAt), eq(menus.id, menuId)),
  });
  return orderData.length;
}
