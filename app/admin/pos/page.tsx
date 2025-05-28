"use client";

import OrderPanel from "@/app/admin/pos/order-panel";
import TablePanel from "@/app/admin/pos/table-panel";
import MenuPanel from "@/app/admin/pos/menu-panel";
import { useEffect } from "react";
import getPosData from "@/lib/get-pos-data";
import { useAtom } from "jotai";
import { posDataState } from "@/lib/states";

export type PosData = Awaited<ReturnType<typeof getPosData>>;

export default function PosPage() {
  const [, setPosData] = useAtom(posDataState);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/pos");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPosData(data);
      } else {
        console.error("Failed to fetch POS data");
      }
    }
    fetchData();
  }, []);

  return (
    <div
      className={
        "w-full h-screen grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4"
      }
    >
      <OrderPanel />
      <TablePanel />
      <MenuPanel />
    </div>
  );
}
