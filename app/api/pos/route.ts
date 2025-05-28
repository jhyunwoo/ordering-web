import { NextResponse } from "next/server";
import { auth } from "@/auth";
import checkUserRole from "@/lib/check-user-role";
import getPosData from "@/lib/get-pos-data";

export async function GET() {
  const session = await auth();
  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getPosData());
}
