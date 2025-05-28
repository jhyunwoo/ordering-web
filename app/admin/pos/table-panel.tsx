"use client";

import CreateTableModal from "@/app/admin/pos/create-table-modal";
import { useAtom } from "jotai/index";
import { useState } from "react";
import { posDataState } from "@/lib/states";

export default function TablePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [posData] = useAtom(posDataState);

  return (
    <div className={"panel-box md:col-span-2"}>
      <div className={"flex items-center justify-between"}>
        <h2 className={"text-lg font-semibold"}>테이블</h2>
        <button
          type={"button"}
          onClick={() => setIsOpen(true)}
          className={"panel-create-button"}
        >
          테이블 추가
        </button>
        <CreateTableModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className={"grid grid-cols-3 gap-2"}>
        {posData?.tables?.map((table, i) => (
          <div key={i} className={"p-2 rounded-lg bg-neutral-100"}>
            <div>{table.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
