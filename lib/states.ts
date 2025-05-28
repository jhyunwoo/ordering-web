import { atom } from "jotai";
import { PosData } from "@/app/admin/pos/page";

export const modalState = atom(false);

export const posDataState = atom<PosData>();
