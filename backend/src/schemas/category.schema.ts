import { z } from "zod";

import { CategoryColor, CategoryIcon } from "../generated/prisma/enums";

export const CATEGORY_COLORS = Object.values(CategoryColor);

export const CATEGORY_ICONS = Object.values(CategoryIcon);

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
