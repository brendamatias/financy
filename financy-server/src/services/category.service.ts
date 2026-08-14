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
    return prismaClient.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async findCategory(id: string, userId: string) {
    const categoryId = validate(categoryIdSchema, id);

    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new Error("Categoria não encontrada!");
    }

    return category;
  }

  async createCategory(input: CreateCategoryInput, userId: string) {
    const data = validate(createCategorySchema, input);

    const alreadyExists = await prismaClient.category.findFirst({
      where: { name: data.name, userId },
    });

    if (alreadyExists) {
      throw new Error("Categoria já existe!");
    }

    return prismaClient.category.create({
      data: { ...data, userId },
    });
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

    return prismaClient.category.update({
      where: { id: categoryId },
      data,
    });
  }

  async deleteCategory(id: string, userId: string) {
    const categoryId = validate(categoryIdSchema, id);

    await this.findCategory(categoryId, userId);

    await prismaClient.category.delete({ where: { id: categoryId } });

    return true;
  }

  async getCategoriesSummary(userId: string) {
    const categories = await this.listCategories(userId);

    return {
      categoriesCount: categories.length,
      transactionsCount: 0,
      mostUsed: categories[0] ?? null,
    };
  }
}
