import { z } from "zod";

export const CATEGORY_COLORS = [
  "green",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
] as const;

export const CATEGORY_ICONS = [
  "briefcase",
  "car",
  "health",
  "investment",
  "market",
  "entertainment",
  "basket",
  "food",
  "cleaning",
  "house",
  "gift",
  "gym",
  "education",
  "bag",
  "card",
  "bill",
  "energy",
] as const;

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Informe o título da categoria"),
  description: z.string().trim().default(""),
  color: z.enum(CATEGORY_COLORS, "Selecione uma cor válida"),
  icon: z.enum(CATEGORY_ICONS, "Selecione um ícone válido"),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdSchema = z
  .string("Informe o id da categoria")
  .trim()
  .min(1, "Informe o id da categoria");
