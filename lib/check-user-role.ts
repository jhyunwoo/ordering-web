import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import db from "@/db";

export default async function checkUserRole({
  userId,
  role,
}: {
  userId: string | null | undefined;
  role: (typeof users.$inferSelect)["role"];
}) {
  if (!userId) {
    return false;
  }
  const userRole = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      role: true,
    },
  });

  if (!userRole) {
    return false;
  }

  return userRole.role === role;
}
