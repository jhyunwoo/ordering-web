"use client";

import CreateMenuModal from "@/app/admin/pos/create-menu-modal";
import { useState } from "react";
import { useAtom } from "jotai";
import { posDataState } from "@/lib/states";
import UpdateMenuModal from "@/app/admin/pos/update-menu-modal";

export default function MenuPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [posData] = useAtom(posDataState);
  const [updateMenuId, setUpdateMenuId] = useState<number>(0);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  return (
    <div className={"panel-box flex flex-col "}>
      <div className={"flex items-center justify-between"}>
        <h2 className={"text-lg font-semibold"}>메뉴 관리</h2>
        <button
          type={"button"}
          onClick={() => setIsOpen(true)}
          className={"panel-create-button"}
        >
          메뉴 추가
        </button>
        <CreateMenuModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <UpdateMenuModal
        isOpen={isUpdateOpen}
        setIsOpen={setIsUpdateOpen}
        menuId={updateMenuId}
      />
      <div className={"flex flex-col gap-2 w-full mt-4"}>
        {posData?.menus?.map((menu, i) => (
          <div
            key={i}
            onClick={() => {
              setUpdateMenuId(menu.id);
              setIsUpdateOpen(true);
            }}
            className={`${menu.available && !(menu.soldQuantity >= menu.quantity) ? "bg-green-50/50 ring-green-500" : "bg-red-50/50 ring-red-600"} ring-2 p-2 rounded-lg px-3`}
          >
            <div className={"text-lg font-semibold"}>{menu.name}</div>
            <div className={"flex flex-col"}>
              <div className={"flex items-center justify-between"}>
                <div>
                  {menu.soldQuantity}/{menu.quantity}
                </div>
                <div>{menu.price}원</div>
              </div>
              <div className={"text-sm"}>팔린 수량 / 총 수량</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
