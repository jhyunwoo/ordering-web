"use client";

import { useAtom } from "jotai";
import { addMenuState } from "@/lib/states";

export default function MenuButton({
  menuData,
}: {
  menuData: {
    name: string;
    description: string;
    price: number;
    available: boolean;
    sold: number;
    quantity: number;
  };
}) {
  const [, setAddMenu] = useAtom(addMenuState);
  return (
    <button
      type={"button"}
      className={`p-2 px-3 rounded-xl flex flex-col gap-2 shadow-lg items-start ${menuData?.available || menuData?.sold >= menuData?.quantity ? "bg-white" : "bg-neutral-400"}`}
      disabled={!(menuData?.available || menuData?.sold >= menuData?.quantity)}
      onClick={() => setAddMenu(menuData.id)}
    >
      <div>
        <h2 className={"text-lg font-semibold"}>{menuData?.name}</h2>
        <p>{menuData?.description}</p>
      </div>
      <div className={"text-lg ml-auto"}>{menuData?.price}원</div>
    </button>
  );
}
