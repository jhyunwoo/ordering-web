"use client";

import ModalLayout from "@/app/components/modal-layout";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
} from "react";
import { createTable } from "@/app/admin/pos/actions";

const initialState = {
  result: "",
};

export default function CreateTableModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [state, formAction, pending] = useActionState(
    createTable,
    initialState,
  );
  console.log(state);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
    setIsOpen(false);
  }

  return (
    <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={"w-full flex flex-col items-center justify-center"}>
        <div className={"text-2xl font-semibold p-4"}>테이블 추가</div>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-3 w-full"}>
          <input
            placeholder={"테이블명"}
            type={"text"}
            required={true}
            name={"name"}
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
