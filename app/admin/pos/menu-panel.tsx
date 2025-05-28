"use client";

import CreateMenuModal from "@/app/admin/pos/create-menu-modal";
import { useState } from "react";

export default function MenuPanel() {
  const [isOpen, setIsOpen] = useState(false);

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
    </div>
  );
}
