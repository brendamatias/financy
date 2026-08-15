import { z } from "zod";

const PERIOD_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

export const dashboardSummarySchema = z.object({
  period: z
    .string()
    .trim()
    .regex(PERIOD_REGEX, "Informe o período no formato MM/AAAA")
    .optional(),
});
