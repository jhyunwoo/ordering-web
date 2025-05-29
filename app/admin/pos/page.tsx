"use client";

import OrderPanel from "@/app/admin/pos/order-panel";
import TablePanel from "@/app/admin/pos/table-panel";
import MenuPanel from "@/app/admin/pos/menu-panel";
import { useEffect, useState } from "react";
import getPosData from "@/lib/get-pos-data";
import { useAtom } from "jotai";
import { posDataState } from "@/lib/states";
import { useQuery } from "@tanstack/react-query";

export type PosData = Awaited<ReturnType<typeof getPosData>>;

export default function PosPage() {
  const [, setPosData] = useAtom(posDataState);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  async function fetchData(): Promise<PosData> {
    const response = await fetch("/api/pos");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    setLastUpdate(new Date()); // 마지막 업데이트 시간을 현재 시간으로 설정
    return response.json();
  }

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
    <div className={"w-full h-screen flex flex-col gap-2 p-4"}>
      <div className={"w-full flex items-baseline gap-4"}>
        <h1 className={"font-semibold text-lg"}>컴퓨터과학과 홈런포차</h1>
        <p>
          Last Update:{" "}
          {new Intl.DateTimeFormat("ko-KR", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(lastUpdate)}
        </p>
      </div>
      <div
        className={
          "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full"
        }
      >
        <OrderPanel />
        <TablePanel />
        <MenuPanel />
      </div>
    </div>
  );
}
