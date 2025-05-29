"use client";

import { useAtom } from "jotai";
import { addMenuState, basketState } from "@/lib/states";
import { useEffect, useState } from "react";
import { menus } from "@/db/schema";

export default function AddMenuModal() {
  const [addMenu, setAddMenu] = useAtom(addMenuState);
  const [menuData, setMenuData] = useState<typeof menus.$inferSelect | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [, setBasket] = useAtom(basketState);

  useEffect(() => {
    async function fetchMenuData() {
      if (addMenu) {
        const reqMenuData = await fetch(`/api/menu/${addMenu}`);
        const data = await reqMenuData.json();
        setMenuData(data);
      }
    }
    fetchMenuData();
  }, [addMenu]);

  return (
    <div
      className={`${addMenu ? "" : "hidden"} fixed top-0 left-0 w-screen h-screen z-10 bg-neutral-500/50 flex items-center justify-center p-4`}
    >
      <div className={"bg-white p-4 rounded-xl w-full"}>
        <div className={"text-xl font-bold"}>{menuData?.name}</div>
        <div className={"flex items-center gap-2 w-full justify-around mt-4"}>
          <button
            type={"button"}
            onClick={() =>
              setQuantity((prev) => {
                if (prev <= 1) return prev;
                return prev - 1;
              })
            }
            className={"bg-sky-500 text-white px-4 p-1 rounded-lg text-lg"}
          >
            -1
          </button>
          <div className={"text-xl font-bold p-1 px-4 rounded-lg ring-2"}>
            {quantity}
          </div>
          <button
            type={"button"}
            onClick={() =>
              setQuantity((prev) => {
                return prev + 1;
              })
            }
            className={"bg-sky-500 text-white px-4 p-1 rounded-lg text-lg"}
          >
            +1
          </button>
        </div>
        <div className={"flex items-center gap-2 w-full justify-around mt-4"}>
          <button
            type={"button"}
            onClick={() => {
              setAddMenu("");
              setQuantity(1);
              setMenuData(null);
            }}
            className={"p-2 px-4 rounded-lg bg-neutral-500 w-1/3 text-white"}
          >
            취소
          </button>
          <button
            className={"p-2 px-4 w-full rounded-lg bg-sky-700 text-white"}
            onClick={() => {
              setBasket((prev) => [
                ...prev,
                {
                  menuId: Number(addMenu)!,
                  quantity: quantity!,
                  menuName: menuData?.name!,
                  menuPrice: menuData?.price!,
                },
              ]);
              setAddMenu("");
              setQuantity(1);
              setMenuData(null);
            }}
          >
            장바구니에 추가
          </button>
        </div>
      </div>
    </div>
  );
}
