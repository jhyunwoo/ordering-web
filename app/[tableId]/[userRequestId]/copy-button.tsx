"use client";

import { ReactNode } from "react";

export default function CopyButton({
  children,
  data,
}: {
  children: ReactNode;
  data: string;
}) {
  return (
    <button
      type={"button"}
      onClick={async () => {
        await navigator.clipboard.writeText(data);
        alert("복사되었습니다.");
      }}
      className={"bg-neutral-300 p-1 px-2 rounded-lg text-base"}
    >
      {children}
    </button>
  );
}
