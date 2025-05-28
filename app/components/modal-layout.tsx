"use client";

import { ReactNode, MouseEvent, Dispatch, SetStateAction } from "react";

export default function ModalLayout({
  children,
  isOpen,
  setIsOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleBackgroundClick = () => {
    // 바깥쪽 클릭 시 실행할 함수
    setIsOpen(false); // 예시로 모달 닫기
  };

  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 차단
  };

  return (
    <div
      className={`z-10 fixed top-0 left-0 w-screen h-screen bg-neutral-500/80 flex items-center justify-center ${isOpen ? "" : "hidden"}`}
      onClick={handleBackgroundClick}
    >
      <div
        className={"w-full max-w-3xl max-h-1/2 p-4 rounded-xl bg-white"}
        onClick={handleModalClick}
      >
        {children}
      </div>
    </div>
  );
}
