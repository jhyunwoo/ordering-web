import db from "@/db";
import { eq, isNull } from "drizzle-orm";
import { menus, tables } from "@/db/schema";

export default async function TablePage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const { tableId } = await params;
  const menuPromise = db.query.menus.findMany({
    where: isNull(menus.deletedAt),
  });
  const tablePromise = db.query.tables.findFirst({
    where: eq(tables.id, tableId),
  });
  const [menuData, tableData] = await Promise.all([menuPromise, tablePromise]);

  return (
    <div className={"w-full min-h-screen flex flex-col p-4"}>
      <div>{tableData?.name}</div>
      <div>
        {menuData?.map((menu, i) => (
          <div key={i}>
            <div>{menu.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
