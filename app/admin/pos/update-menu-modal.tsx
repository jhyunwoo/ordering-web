"use client";

import ModalLayout from "@/app/components/modal-layout";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { updateMenu } from "@/app/admin/pos/actions";
import { useAtom } from "jotai/index";
import { posDataState } from "@/lib/states";
import { PosData } from "@/app/admin/pos/page";

const initialState = {
  result: "",
};

export default function UpdateMenuModal({
  isOpen,
  setIsOpen,
  menuId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  menuId: number;
}) {
  const [state, formAction, pending] = useActionState(updateMenu, initialState);
  const [posData] = useAtom(posDataState);
  const [menuData, setMenuData] = useState<PosData["menus"][0]>();
  const [canOrder, setCanOrder] = useState<string>("yes");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
    setIsOpen(false);
  }

  useEffect(() => {
    setMenuData(posData?.menus.filter((menu) => menu.id === menuId)?.[0]);
  }, [posData, menuId]);

  useEffect(() => {
    if (menuData) {
      console.log(menuData.available);
      setCanOrder(menuData.available ? "yes" : "no");
    }
  }, [menuData]);

  console.log(menuData);

  return (
    <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={"w-full flex flex-col items-center justify-center"}>
        <div className={"text-2xl font-semibold p-4"}>메뉴 수정</div>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-3 w-full"}>
          <input
            hidden={true}
            defaultValue={menuData?.id}
            name={"id"}
            readOnly={true}
          />
          <div>
            <p>메뉴명</p>
            <input
              placeholder={"메뉴명"}
              type={"text"}
              required={true}
              name={"name"}
              className={"default-input"}
              defaultValue={menuData?.name}
            />
          </div>
          <div>
            <p>메뉴 설명</p>
            <input
              placeholder={"설명"}
              type={"text"}
              required={true}
              name={"description"}
              defaultValue={menuData?.description}
              className={"default-input"}
            />
          </div>
          <div>
            <p>가격</p>
            <input
              placeholder={"가격"}
              type={"number"}
              required={true}
              name={"price"}
              className={"default-input"}
              defaultValue={menuData?.price}
            />
          </div>
          <div>
            <p>총 수량</p>
            <input
              placeholder={"총 수량"}
              type={"number"}
              required={true}
              name={"quantity"}
              className={"default-input"}
              defaultValue={menuData?.quantity}
            />
          </div>
          <div className={"flex items-center justify-start gap-2"}>
            <p>주문 가능 여부</p>
            <input
              name={"available"}
              value={canOrder}
              hidden={true}
              readOnly={true}
            />
            <div className={"flex items-center gap-2"}>
              <button
                className={`${canOrder === "yes" ? "bg-green-600 text-white" : "bg-green-50"} p-1 px-2 rounded-lg text-sm`}
                type={"button"}
                onClick={() => setCanOrder("yes")}
              >
                주문 가능
              </button>
              <button
                className={`${canOrder === "no" ? "bg-red-600 text-white" : "bg-red-50"} p-1 px-2 rounded-lg text-sm`}
                type={"button"}
                onClick={() => setCanOrder("no")}
              >
                주문 불가
              </button>
            </div>
          </div>

          <button
            type={"submit"}
            className={"p-2 rounded-lg px-4 bg-neutral-950 text-white"}
            disabled={pending}
          >
            {pending ? "수정 중..." : "메뉴 수정"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
}
