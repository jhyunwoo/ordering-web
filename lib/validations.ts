import { z } from "zod";

export const createMenuValidation = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number().nonnegative().int().gte(0),
  price: z.number().nonnegative().int().gte(0),
  available: z.boolean(),
});
export const updateMenuValidation = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number().nonnegative().int().gte(0),
  price: z.number().nonnegative().int().gte(0),
  available: z.boolean(),
});

export const createOrderValidation = z.object({
  tableId: z.string().min(1),
  menuId: z.number().min(1),
  quantity: z.number().nonnegative().int().gte(1),
});

export const createTableValidation = z.object({
  name: z.string().min(1),
});
