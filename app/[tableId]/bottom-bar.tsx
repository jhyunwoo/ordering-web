"use client";

import { useAtom } from "jotai/index";
import { basketState } from "@/lib/states";
import BasketModal from "@/app/[tableId]/basket-modal";
import { useState } from "react";

export default function BottomBar({ tableId }: { tableId: string }) {
  const [basket] = useAtom(basketState);
  const [openBasket, setOpenBasket] = useState(false);

  return (
    <div className={"fixed bottom-0 left-0 w-full p-4"}>
      {openBasket && <BasketModal tableId={tableId} />}
      <button
        type={"button"}
        className={
          "w-full rounded-full p-2 bg-sky-500 text-white text-lg font-semibold shadow-xl"
        }
        onClick={() => setOpenBasket(true)}
      >
        장바구니 {basket.length}
      </button>
    </div>
  );
}
