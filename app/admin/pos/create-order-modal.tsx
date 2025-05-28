"use client";

import ModalLayout from "@/app/components/modal-layout";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
} from "react";
import { createOrder } from "@/app/admin/pos/actions";
import { useAtom } from "jotai/index";
import { posDataState } from "@/lib/states";

const initialState = {
  result: "",
};

export default function CreateOrderModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [state, formAction, pending] = useActionState(
    createOrder,
    initialState,
  );
  console.log(state);
  const [posData] = useAtom(posDataState);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
    setIsOpen(false);
  }

  return (
    <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={"w-full flex flex-col items-center justify-center"}>
        <div className={"text-2xl font-semibold p-4"}>주문 추가</div>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-3 w-full"}>
          <select
            name="menuId"
            className={
              "flex flex-col gap-1 p-2 rounded-lg focus:outline-none ring-2 ring-sky-500"
            }
            required={true}
          >
            {posData?.menus.map((menu) => (
              <option
                key={menu.id}
                value={menu.id}
                className={"p-1 px-2 rounded-lg"}
              >
                {menu.name}
              </option>
            ))}
          </select>
          <select
            name="tableId"
            className={
              "flex flex-col gap-1 p-2 rounded-lg focus:outline-none ring-2 ring-sky-500"
            }
            required={true}
          >
            {posData?.tables.map((table) => (
              <option
                key={table.id}
                value={table.id}
                className={"p-1 px-2 rounded-lg"}
              >
                {table.name}
              </option>
            ))}
          </select>
          <input
            placeholder={"수량"}
            type={"number"}
            required={true}
            name={"quantity"}
            className={"default-input"}
          />

          <button
            type={"submit"}
            className={"p-2 rounded-lg px-4 bg-neutral-950 text-white"}
            disabled={pending}
          >
            {pending ? "추가 중..." : "메뉴 추가"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
}
