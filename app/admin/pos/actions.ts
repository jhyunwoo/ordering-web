"use server";
import db from "@/db";
import { menus, orders, tables, userRequests } from "@/db/schema";
import { auth } from "@/auth";
import { forbidden, redirect } from "next/navigation";
import checkUserRole from "@/lib/check-user-role";
import {
  createMenuValidation,
  createOrderValidation,
  createTableValidation,
} from "@/lib/validations";
import { eq, isNull } from "drizzle-orm";

export async function createMenu(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }
  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    forbidden();
  }

  const validatedFields = createMenuValidation.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    quantity: Number(formData.get("quantity")),
    price: Number(formData.get("price")),
    available: formData.get("available") === "on",
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      result: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, description, quantity, price, available } =
    validatedFields.data;

  try {
    await db
      .insert(menus)
      .values({ name, description, quantity, price, available });
  } catch (e) {
    console.error(e);
    return { result: "데이터베이스에 저장하는 중 오류가 발생했습니다." };
  }
  return { result: "메뉴가 성공적으로 추가되었습니다." };
}

export async function createOrder(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }

  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    forbidden();
  }

  const validatedFields = createOrderValidation.safeParse({
    tableId: formData.get("tableId"),
    menuId: Number(formData.get("menuId")),
    quantity: Number(formData.get("quantity")),
  });
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      result: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { tableId, menuId, quantity } = validatedFields.data;
  try {
    const tablePromise = db.query.tables.findFirst({
      where: eq(tables.id, tableId),
      columns: {
        key: true,
        name: true,
      },
    });
    const menuPromise = db.query.menus.findFirst({
      where: eq(menus.id, menuId),
    });
    const [tableData, menuData] = await Promise.all([
      tablePromise,
      menuPromise,
    ]);
    const createUserRequest = await db
      .insert(userRequests)
      .values({
        tableId: tableId,
        amount: menuData?.price! * quantity,
      })
      .returning();

    const values = Array.from({ length: quantity }, () => ({
      userRequestId: createUserRequest[0].id,
      menuName: menuData?.name!,
      menuPrice: menuData?.price!,
      tableName: tableData?.name!,
    }));
    await db.insert(orders).values(values);
  } catch (e) {
    console.error(e);
    return { result: "데이터베이스에 저장하는 중 오류가 발생했습니다." };
  }
  return { result: "주문이 성공적으로 생성되었습니다." };
}

export async function createTable(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }
  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    forbidden();
  }

  const validatedFields = createTableValidation.safeParse({
    name: formData.get("name"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      result: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name } = validatedFields.data;

  try {
    const tableData = await db.query.tables.findMany({
      where: isNull(tables.deletedAt),
    });
    let lowestKey = tableData ? tableData.length : 1;

    if (tableData) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].key !== i + 1) {
          lowestKey = i + 1;
          break;
        }
      }
    }

    await db.insert(tables).values({ name, key: lowestKey });
  } catch (e) {
    console.error(e);
    return { result: "데이터베이스에 저장하는 중 오류가 발생했습니다." };
  }
  return { result: "테이블이 성공적으로 추가되었습니다." };
}
