import { ReactNode } from "react";
import { auth } from "@/auth";
import { forbidden, redirect } from "next/navigation";
import checkUserRole from "@/lib/check-user-role";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }
  if (!(await checkUserRole({ userId: session?.user?.id, role: "ADMIN" }))) {
    forbidden();
  }
  return <>{children}</>;
}
