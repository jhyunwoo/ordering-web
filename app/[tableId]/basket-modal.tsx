"use client";
import { useAtom } from "jotai";
import { basketState } from "@/lib/states";
import { redirect, useRouter } from "next/navigation";

export default function BasketModal({ tableId }: { tableId: string }) {
  const [basket] = useAtom(basketState);
  console.log(basket);
  const router = useRouter();

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-10 bg-neutral-500/50 flex items-center justify-center p-4`}
    >
      <div className={"bg-white p-4 rounded-xl w-full flex flex-col gap-2"}>
        <div className={"text-xl font-bold"}>장바구니</div>
        <div>
          {basket?.map((item, i) => (
            <div
              key={i}
              className={"flex items-center justify-between p-2 border-b"}
            >
              <div>{item?.menuName}</div>
              <div>{item?.quantity}개</div>
            </div>
          ))}
        </div>
        <div className={"ml-auto"}>
          총{" "}
          {basket?.reduce(
            (sum, item) => sum + item?.menuPrice * item?.quantity,
            0,
          )}
          원
        </div>
        <button
          type={"button"}
          className={"w-full p-2 rounded-xl bg-sky-900 text-white mt-4"}
          onClick={async () => {
            const requestOrder = await fetch("/api/order", {
              method: "POST",
              body: JSON.stringify({
                tableId: tableId, // 실제 테이블 ID로 변경 필요
                basket: basket,
              }),
            });
            const result = await requestOrder.json();
            if (!result.result?.userRequestId) {
              alert(result.result);
            } else {
              router.push(`/${tableId}/${result.result.userRequestId}`);
            }
          }}
        >
          주문하기
        </button>
      </div>
    </div>
  );
}
