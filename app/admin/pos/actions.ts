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
  updateMenuValidation,
} from "@/lib/validations";
import { asc, eq, isNull } from "drizzle-orm";

export async function createMenu(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }
  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    forbidden();
  }
  console.log(formData.get("available"));
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

export async function updateMenu(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }
  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    forbidden();
  }

  const validatedFields = updateMenuValidation.safeParse({
    id: Number(formData.get("id")),
    name: formData.get("name"),
    description: formData.get("description"),
    quantity: Number(formData.get("quantity")),
    price: Number(formData.get("price")),
    available: formData.get("available") === "yes",
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      result: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { id, name, description, quantity, price, available } =
    validatedFields.data;

  console.log(id, available);

  try {
    await db
      .update(menus)
      .set({ name, description, quantity, price, available: available })
      .where(eq(menus.id, id));
  } catch (e) {
    console.error(e);
    return { result: "데이터베이스에 저장하는 중 오류가 발생했습니다." };
  }
  return { result: "메뉴가 성공적으로 업데이트 되었습니다." };
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
        amount: menuData?.price! * quantity,
        key: lowestKey,
      })
      .returning();

    const values = Array.from({ length: quantity }, () => ({
      userRequestId: createUserRequest[0].id,
      menuName: menuData?.name!,
      menuPrice: menuData?.price!,
      tableName: tableData?.name!,
      menuId: menuData?.id!,
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
    await db.insert(tables).values({ name });
  } catch (e) {
    console.error(e);
    return { result: "데이터베이스에 저장하는 중 오류가 발생했습니다." };
  }
  return { result: "테이블이 성공적으로 추가되었습니다." };
}

export async function updateOrderStatus(prev: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }
  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    forbidden();
  }

  const status = formData.get("status") as "WAITING" | "PENDING" | "COMPLETE";
  const orderId = formData.get("orderId") as string;

  console.log(orderId, status);

  if (!status || !orderId) {
    return { result: "잘못된 요청입니다." };
  }

  try {
    await db
      .update(orders)
      .set({ status: status })
      .where(eq(orders.id, orderId));
  } catch (e) {
    console.error(e);
    return { result: "데이터베이스에 저장하는 중 오류가 발생했습니다." };
  }
  return { result: "주문 상태가 성공적으로 업데이트 되었습니다." };
}
