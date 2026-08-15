import { z } from "zod";

import { TransactionType } from "../generated/prisma/enums";
import { isRealDate } from "../utils/period";

export const TRANSACTION_TYPES = Object.values(TransactionType);

const PERIOD_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const transactionIdSchema = z
  .string("Informe o id da transação")
  .trim()
  .min(1, "Informe o id da transação");

function isNotInTheFuture(date: string) {
  const today = new Date();
  const todayISO = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  )
    .toISOString()
    .slice(0, 10);

  return date <= todayISO;
}

export const createTransactionSchema = z.object({
  description: z.string().trim().min(1, "Informe a descrição"),
  amount: z
    .number("Informe o valor")
    .positive("O valor deve ser maior que zero"),
  type: z.enum(TRANSACTION_TYPES, "Selecione um tipo válido"),
  date: z
    .string()
    .trim()
    .regex(DATE_REGEX, "Informe uma data válida no formato AAAA-MM-DD")
    .refine(isRealDate, "Informe uma data que exista no calendário")
    .refine(isNotInTheFuture, "A data não pode ser no futuro"),
  categoryId: z.string().trim().min(1, "Selecione uma categoria"),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const listTransactionsSchema = z.object({
  searchQuery: z.string().trim().default(""),
  type: z.enum([...TRANSACTION_TYPES, "all"]).default("all"),
  categoryId: z.string().trim().default("all"),
  period: z
    .string()
    .trim()
    .regex(PERIOD_REGEX, "Informe o período no formato MM/AAAA")
    .optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
});
