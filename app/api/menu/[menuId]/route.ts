import db from "@/db";
import { eq } from "drizzle-orm";
import { menus } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ menuId: string }> },
) {
  const { menuId } = await params;

  const menuData = await db.query.menus.findFirst({
    where: eq(menus.id, Number(menuId)),
  });

  return NextResponse.json(menuData);
}
