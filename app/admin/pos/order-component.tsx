"use client";

import orderStatusConverter from "@/lib/order-status-converter";
import { PosData } from "@/app/admin/pos/page";
import { useActionState, useRef, useState } from "react";
import { createTable, updateOrderStatus } from "@/app/admin/pos/actions";

const initialState = {
  result: "",
};

export default function OrderComponent({
  orderData,
}: {
  orderData: PosData["orders"][0];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState(
    updateOrderStatus,
    initialState,
  );
  console.log(state);

  const handleClick = (value: string) => {
    if (inputRef.current && formRef.current) {
      inputRef.current.value = value;
      formRef.current.requestSubmit(); // form을 바로 submit
    }
  };

  return (
    <div className={"bg-neutral-50 p-1 px-2 rounded-lg"}>
      <div
        className={
          "flex items-center justify-between font-semibold text-lg py-1"
        }
      >
        <div>메뉴: {orderData.menuName}</div>
        <div>테이블: {orderData.tableName}</div>
      </div>
      <div>상태: {orderStatusConverter(orderData.status)}</div>

      <div>
        주문 시각:{" "}
        {new Intl.DateTimeFormat("ko-KR", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date(orderData.createdAt!))}
      </div>
      <form
        className={"flex gap-2 items-center w-full"}
        ref={formRef}
        action={formAction}
      >
        <input name={"status"} hidden={true} ref={inputRef} readOnly={true} />
        <input
          name={"orderId"}
          hidden={true}
          readOnly={true}
          defaultValue={orderData.id}
        />
        {orderData.status !== "WAITING" && (
          <button
            className={"p-1 px-2 rounded-lg w-full bg-orange-500 text-white"}
            type={"button"}
            onClick={() => handleClick("WAITING")}
            disabled={pending}
          >
            입금 대기 {pending && "..."}
          </button>
        )}
        {orderData.status !== "PENDING" && (
          <button
            className={"p-1 px-2 rounded-lg w-full bg-blue-600 text-white"}
            onClick={() => handleClick("PENDING")}
            disabled={pending}
          >
            조리중 {pending && "..."}
          </button>
        )}
        {orderData.status !== "COMPLETE" && (
          <button
            className={"p-1 px-2 rounded-lg w-full bg-green-600 text-white"}
            onClick={() => handleClick("COMPLETE")}
            disabled={pending}
          >
            처리 완료 {pending && "..."}
          </button>
        )}
      </form>
    </div>
  );
}
