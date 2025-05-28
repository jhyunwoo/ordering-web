"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { modalState, posDataState } from "@/lib/states";
import CreateOrderModal from "@/app/admin/pos/create-order-modal";

export default function OrderPanel() {
  const [orderStatus, setOrderStatus] = useState<
    "WAITING" | "PENDING" | "COMPLETE"
  >("PENDING");
  const [isOpen, setIsOpen] = useAtom(modalState);
  const [posData] = useAtom(posDataState);

  return (
    <div className={"panel-box flex flex-col gap-2"}>
      <div className={"flex items-center justify-between"}>
        <h2 className={"text-lg font-semibold"}>주문 목록</h2>
        <button
          type={"button"}
          onClick={() => setIsOpen(true)}
          className={"panel-create-button"}
        >
          주문 추가
        </button>
        <CreateOrderModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className={"flex items-center gap-2"}>
        <button
          type={"button"}
          onClick={() => setOrderStatus("PENDING")}
          className={`${orderStatus === "PENDING" ? "bg-neutral-950 text-white ring-neutral-950" : "bg-neutral-100 ring-neutral-500"} px-2 p-1 rounded-lg ring-1`}
        >
          입금 완료
        </button>
        <button
          type={"button"}
          onClick={() => setOrderStatus("WAITING")}
          className={`${orderStatus === "WAITING" ? "bg-neutral-950 text-white ring-neutral-950" : "bg-neutral-100 ring-neutral-500"} px-2 p-1 rounded-lg ring-1`}
        >
          입금 대기
        </button>
        <button
          type={"button"}
          onClick={() => setOrderStatus("COMPLETE")}
          className={`${orderStatus === "COMPLETE" ? "bg-neutral-950 text-white ring-neutral-950" : "bg-neutral-100 ring-neutral-500"} px-2 p-1 rounded-lg ring-1`}
        >
          처리 완료
        </button>
      </div>
      <div>
        {posData?.orders
          ?.filter((data) => data.status === orderStatus)
          ?.map((order, i) => (
            <div key={i}>
              <div>{order.menuName}</div>
              <div>{order.status}</div>
              <div>{order.tableName}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
