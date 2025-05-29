import { NextRequest, NextResponse } from "next/server";
import { getSoldQuantity } from "@/lib/get-sold-quantity";
import db from "@/db";
import { asc, eq, isNull } from "drizzle-orm";
import { menus, orders, tables, userRequests } from "@/db/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tableId, basket } = body as {
    tableId: string;
    basket: {
      menuName: string;
      menuPrice: number;
      menuId: number;
      quantity: number;
    }[];
  };

  for (const item of basket) {
    const menuData = await db.query.menus.findFirst({
      where: eq(menus.id, item.menuId),
    });
    if (!menuData) {
      return NextResponse.json(
        { result: "메뉴가 존재하지 않습니다." },
        { status: 400 },
      );
    }
    const soldQuantity = await getSoldQuantity(item.menuId);
    if (item.quantity + soldQuantity > menuData?.quantity) {
      return NextResponse.json(
        { result: "주문 수량이 재고를 초과했습니다." },
        { status: 400 },
      );
    }
  }

  let lowestKey = 1;
  const userRequestData = await db.query.userRequests.findMany({
    where: isNull(userRequests.deletedAt),
    orderBy: asc(userRequests.key),
  });
  // userRequests에서 사용하지 않은 key값 중 가장 작은 값 찾기
  if (userRequestData.length > 0) {
    const usedKeys = userRequestData.map((request) => request.key);
    for (let i = 1; i <= userRequestData.length + 1; i++) {
      if (!usedKeys.includes(i)) {
        lowestKey = i;
        break;
      }
    }
  }

  const createUserRequest = await db
    .insert(userRequests)
    .values({
      tableId: tableId,
      amount:
        basket?.reduce(
          (sum, item) => sum + item?.menuPrice * item?.quantity,
          0,
        ) - lowestKey,
      key: lowestKey,
    })
    .returning();

  for (const item of basket) {
    const menuData = await db.query.menus.findFirst({
      where: eq(menus.id, item.menuId),
    });
    const tableData = await db.query.tables.findFirst({
      where: eq(tables.id, tableId),
      columns: {
        name: true,
      },
    });
    if (!menuData || !tableData) {
      return NextResponse.json(
        { result: "메뉴가 존재하지 않습니다." },
        { status: 400 },
      );
    }
    const values = Array.from({ length: item.quantity }, () => ({
      userRequestId: createUserRequest[0].id,
      menuName: menuData.name,
      menuPrice: menuData.price,
      tableName: tableData.name,
      menuId: menuData.id,
    }));
    await db.insert(orders).values(values);
  }
  return NextResponse.json(
    { result: { userRequestId: createUserRequest[0].id } },
    { status: 200 },
  );
}
