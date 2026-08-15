import { prismaClient } from "../../prisma/prisma";
import { AuthService } from "../services/auth.service";
import { CategoryService } from "../services/category.service";

const authService = new AuthService();
const categoryService = new CategoryService();

export async function createUser(
  overrides: Partial<{ name: string; email: string; password: string }> = {},
) {
  const { user } = await authService.register({
    name: "Conta Teste",
    email: "conta@teste.com",
    password: "12345678",
    ...overrides,
  });

  return user;
}

export async function createCategory(
  userId: string,
  overrides: Partial<{
    name: string;
    description: string;
    color: string;
    icon: string;
  }> = {},
) {
  return categoryService.createCategory(
    {
      name: "Alimentação",
      description: "",
      color: "blue",
      icon: "food",
      ...overrides,
    },
    userId,
  );
}

export async function createTransaction({
  userId,
  categoryId,
  description = "Transação",
  amount = 100,
  type = "expense",
  date = "2025-11-10",
}: {
  userId: string;
  categoryId: string;
  description?: string;
  amount?: number;
  type?: string;
  date?: string | Date;
}) {
  return prismaClient.transaction.create({
    data: {
      description,
      amount,
      type,
      date: date instanceof Date ? date : new Date(`${date}T00:00:00.000Z`),
      categoryId,
      userId,
    },
  });
}
