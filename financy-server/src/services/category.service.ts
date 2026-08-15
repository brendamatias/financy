import { prismaClient } from "../../prisma/prisma";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";
import { validate } from "../utils/validate";

export class CategoryService {
  async listCategories(userId: string) {
    const [categories, stats] = await Promise.all([
      prismaClient.category.findMany({
        where: { userId },
        orderBy: { name: "asc" },
      }),
      prismaClient.transaction.groupBy({
        by: ["categoryId"],
        where: { userId },
        _count: { _all: true },
        _sum: { amount: true },
      }),
    ]);

    return categories.map((category) => {
      const stat = stats.find((item) => item.categoryId === category.id);

      return {
        ...category,
        transactionsCount: stat?._count._all ?? 0,
        total: stat?._sum.amount ?? 0,
      };
    });
  }

  async findCategory(id: string, userId: string) {
    const categoryId = validate(categoryIdSchema, id);

    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
      include: { _count: { select: { transactions: true } } },
    });

    if (!category) {
      throw new Error("Categoria não encontrada!");
    }

    const total = await prismaClient.transaction.aggregate({
      where: { categoryId, userId },
      _sum: { amount: true },
    });

    return {
      ...category,
      transactionsCount: category._count.transactions,
      total: total._sum.amount ?? 0,
    };
  }

  async createCategory(input: CreateCategoryInput, userId: string) {
    const data = validate(createCategorySchema, input);

    const alreadyExists = await prismaClient.category.findFirst({
      where: { name: data.name, userId },
    });

    if (alreadyExists) {
      throw new Error("Categoria já existe!");
    }

    const category = await prismaClient.category.create({
      data: { ...data, userId },
    });

    return { ...category, transactionsCount: 0, total: 0 };
  }

  async updateCategory(id: string, input: UpdateCategoryInput, userId: string) {
    const categoryId = validate(categoryIdSchema, id);
    const data = validate(updateCategorySchema, input);

    await this.findCategory(categoryId, userId);

    if (data.name) {
      const alreadyExists = await prismaClient.category.findFirst({
        where: { name: data.name, userId, NOT: { id: categoryId } },
      });

      if (alreadyExists) {
        throw new Error("Categoria já existe!");
      }
    }

    await prismaClient.category.update({
      where: { id: categoryId },
      data,
    });

    return this.findCategory(categoryId, userId);
  }

  async deleteCategory(id: string, userId: string) {
    const categoryId = validate(categoryIdSchema, id);

    await this.findCategory(categoryId, userId);

    await prismaClient.category.delete({ where: { id: categoryId } });

    return true;
  }

  async getCategoriesSummary(userId: string) {
    const categories = await this.listCategories(userId);

    const mostUsed = [...categories].sort(
      (a, b) => b.transactionsCount - a.transactionsCount,
    )[0];

    return {
      categoriesCount: categories.length,
      transactionsCount: categories.reduce(
        (count, category) => count + category.transactionsCount,
        0,
      ),
      mostUsed: mostUsed ?? null,
    };
  }
}
