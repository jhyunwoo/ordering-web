import db from "@/db";
import { asc, isNull } from "drizzle-orm";
import { menus, orders, tables } from "@/db/schema";

export default async function getPosData() {
  const orderPromise = db.query.orders.findMany({
    where: isNull(orders.deletedAt),
  });
  const tablePromise = db.query.tables.findMany({
    where: isNull(tables.deletedAt),
    orderBy: asc(tables.createdAt),
  });
  const menuPromise = db.query.menus.findMany({
    where: isNull(menus.deletedAt),
    orderBy: asc(menus.createdAt),
  });

  const [orderData, tableData, menuData] = await Promise.all([
    orderPromise,
    tablePromise,
    menuPromise,
  ]);

  const menuWithSoldQuantityData = [];
  for (const menu of menuData) {
    // orderData에서 menuId가 menu.id인 주문의 수량을 합산
    const quantity = orderData.reduce((acc, order) => {
      return acc + (order.menuId === menu.id ? 1 : 0);
    }, 0);
    menuWithSoldQuantityData.push({
      ...menu,
      soldQuantity: quantity,
    });
  }

  return {
    orders: orderData,
    tables: tableData,
    menus: menuWithSoldQuantityData,
  };
}
