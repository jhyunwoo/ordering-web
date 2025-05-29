import db from "@/db";
import { eq, isNull } from "drizzle-orm";
import { menus, tables } from "@/db/schema";
import { getSoldQuantity } from "@/lib/get-sold-quantity";
import MenuButton from "@/app/[tableId]/menu-button";
import BottomBar from "@/app/[tableId]/bottom-bar";
import AddMenuModal from "@/app/[tableId]/add-menu-modal";

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

  const menuDataWithSoldQuantity = [];

  for (const menu of menuData) {
    menuDataWithSoldQuantity.push({
      ...menu,
      sold: await getSoldQuantity(menu.id),
    });
  }

  return (
    <div className={"w-full min-h-screen flex flex-col p-4 gap-2"}>
      <h1 className={"text-xl font-bold"}>연세대학교 컴퓨터과학과 홈런포차</h1>
      <div className={"p-2 rounded-xl bg-white ring-2 px-3"}>
        <p>{tableData?.name} 테이블</p>
      </div>
      <div className={"text-lg text-neutral-600"}>메뉴</div>
      <div className={"flex w-full flex-col gap-4"}>
        {menuDataWithSoldQuantity?.map((menu, i) => (
          <MenuButton menuData={menu} key={i} />
        ))}
      </div>
      <BottomBar tableId={tableId} />
      <AddMenuModal />
    </div>
  );
}
