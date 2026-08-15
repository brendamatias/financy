import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome completo").optional(),
});
