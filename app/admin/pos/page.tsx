"use client";

import OrderPanel from "@/app/admin/pos/order-panel";
import TablePanel from "@/app/admin/pos/table-panel";
import MenuPanel from "@/app/admin/pos/menu-panel";
import { useEffect } from "react";
import getPosData from "@/lib/get-pos-data";
import { useAtom } from "jotai";
import { posDataState } from "@/lib/states";
import { useQuery } from "@tanstack/react-query";

export type PosData = Awaited<ReturnType<typeof getPosData>>;

async function fetchData(): Promise<PosData> {
  const response = await fetch("/api/pos");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function PosPage() {
  const [, setPosData] = useAtom(posDataState);

  const { data, error, isLoading } = useQuery<PosData>({
    queryKey: ["posData"],
    queryFn: fetchData,
    staleTime: 0,
    refetchInterval: 1000, // 1초마다 refetch
  });

  useEffect(() => {
    if (data) {
      setPosData(data); // 데이터를 jotai 상태로 저장
    }
  }, [data, setPosData]);

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
