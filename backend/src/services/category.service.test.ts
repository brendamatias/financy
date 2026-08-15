import { beforeEach, describe, expect, it } from "vitest";

import { prismaClient } from "../../prisma/prisma";
import { CreateCategoryInput } from "../dtos/input/category.input";
import type { CategoryColor, CategoryIcon } from "../generated/prisma/enums";
import { createTransaction, createUser } from "../tests/factories";
import { CategoryService } from "./category.service";

const categoryService = new CategoryService();

const validCategory: CreateCategoryInput = {
  name: "Alimentação",
  description: "Restaurantes e delivery",
  color: "blue",
  icon: "food",
};

let userId: string;
let otherUserId: string;

beforeEach(async () => {
  const owner = await createUser();
  const other = await createUser({
    name: "Outra Conta",
    email: "outra@teste.com",
  });

  userId = owner.id;
  otherUserId = other.id;
});

describe("CategoryService.createCategory", () => {
  it("creates a category for the given user", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    expect(category.name).toBe(validCategory.name);
    expect(category.userId).toBe(userId);
  });

  it("rejects an invalid color", async () => {
    await expect(
      categoryService.createCategory(
        { ...validCategory, color: "roxo" as CategoryColor },
        userId,
      ),
    ).rejects.toThrow("Selecione uma cor válida");
  });

  it("rejects an invalid icon", async () => {
    await expect(
      categoryService.createCategory(
        { ...validCategory, icon: "foguete" as CategoryIcon },
        userId,
      ),
    ).rejects.toThrow("Selecione um ícone válido");
  });

  it("rejects a duplicated name for the same user", async () => {
    await categoryService.createCategory(validCategory, userId);

    await expect(
      categoryService.createCategory(validCategory, userId),
    ).rejects.toThrow("Categoria já existe!");
  });

  it("allows the same name for different users", async () => {
    await categoryService.createCategory(validCategory, userId);

    const category = await categoryService.createCategory(
      validCategory,
      otherUserId,
    );

    expect(category.userId).toBe(otherUserId);
  });
});

describe("CategoryService category stats", () => {
  it("starts with no transactions", async () => {
    await categoryService.createCategory(validCategory, userId);

    const [category] = await categoryService.listCategories(userId);

    expect(category.transactionsCount).toBe(0);
    expect(category.total).toBe(0);
  });

  it("counts the transactions and sums the amounts", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    await createTransaction({
      userId: userId,
      categoryId: category.id,
      amount: 89.5,
    });
    await createTransaction({
      userId: userId,
      categoryId: category.id,
      amount: 10.5,
    });

    const [result] = await categoryService.listCategories(userId);

    expect(result.transactionsCount).toBe(2);
    expect(result.total).toBe(100);
  });

  it("does not count transactions from another user", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    const [result] = await categoryService.listCategories(userId);

    expect(result.transactionsCount).toBe(0);
    expect(category.transactionsCount).toBe(0);
  });

  it("keeps the stats when the category is found by id", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    await createTransaction({
      userId: userId,
      categoryId: category.id,
      amount: 25,
    });

    const result = await categoryService.findCategory(category.id, userId);

    expect(result.transactionsCount).toBe(1);
    expect(result.total).toBe(25);
  });
});

describe("CategoryService.listCategories", () => {
  it("returns only the categories of the given user", async () => {
    await categoryService.createCategory(validCategory, userId);
    await categoryService.createCategory(
      { ...validCategory, name: "Transporte", color: "purple", icon: "car" },
      otherUserId,
    );

    const categories = await categoryService.listCategories(userId);

    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe(validCategory.name);
  });
});

describe("CategoryService.updateCategory", () => {
  it("updates the category fields", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    const updated = await categoryService.updateCategory(
      category.id,
      { name: "Mercado", color: "orange" },
      userId,
    );

    expect(updated.name).toBe("Mercado");
    expect(updated.color).toBe("orange");
    expect(updated.icon).toBe(validCategory.icon);
  });

  it("requires the category id", async () => {
    await expect(
      categoryService.updateCategory("", { name: "Mercado" }, userId),
    ).rejects.toThrow("Informe o id da categoria");
  });

  it("rejects a category from another user", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      otherUserId,
    );

    await expect(
      categoryService.updateCategory(category.id, { name: "Mercado" }, userId),
    ).rejects.toThrow("Categoria não encontrada!");
  });
});

describe("CategoryService.deleteCategory", () => {
  it("deletes the category", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    await expect(
      categoryService.deleteCategory(category.id, userId),
    ).resolves.toBe(true);

    expect(await prismaClient.category.count()).toBe(0);
  });

  it("requires the category id", async () => {
    await expect(categoryService.deleteCategory("", userId)).rejects.toThrow(
      "Informe o id da categoria",
    );
  });

  it("rejects a category from another user", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      otherUserId,
    );

    await expect(
      categoryService.deleteCategory(category.id, userId),
    ).rejects.toThrow("Categoria não encontrada!");

    expect(await prismaClient.category.count()).toBe(1);
  });

  it("does not delete a category that has transactions", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    await createTransaction({
      userId: userId,
      categoryId: category.id,
      amount: 50,
    });

    await expect(
      categoryService.deleteCategory(category.id, userId),
    ).rejects.toThrow();

    expect(await prismaClient.category.count()).toBe(1);
  });
});

describe("CategoryService.getCategoriesSummary", () => {
  it("counts only the categories of the given user", async () => {
    await categoryService.createCategory(validCategory, userId);
    await categoryService.createCategory(
      { ...validCategory, name: "Transporte", color: "purple", icon: "car" },
      userId,
    );
    await categoryService.createCategory(validCategory, otherUserId);

    const summary = await categoryService.getCategoriesSummary(userId);

    expect(summary.categoriesCount).toBe(2);
  });

  it("returns an empty summary when the user has no categories", async () => {
    const summary = await categoryService.getCategoriesSummary(userId);

    expect(summary.categoriesCount).toBe(0);
    expect(summary.mostUsed).toBeNull();
  });

  it("counts the transactions of the user", async () => {
    const category = await categoryService.createCategory(
      validCategory,
      userId,
    );

    await createTransaction({
      userId: userId,
      categoryId: category.id,
      amount: 10,
    });
    await createTransaction({
      userId: userId,
      categoryId: category.id,
      amount: 20,
    });

    const summary = await categoryService.getCategoriesSummary(userId);

    expect(summary.transactionsCount).toBe(2);
  });

  it("returns the category with most transactions as the most used one", async () => {
    const food = await categoryService.createCategory(validCategory, userId);
    const transport = await categoryService.createCategory(
      { ...validCategory, name: "Transporte", color: "purple", icon: "car" },
      userId,
    );

    await createTransaction({
      userId: userId,
      categoryId: food.id,
      amount: 10,
    });
    await createTransaction({
      userId: userId,
      categoryId: transport.id,
      amount: 10,
    });
    await createTransaction({
      userId: userId,
      categoryId: transport.id,
      amount: 10,
    });

    const summary = await categoryService.getCategoriesSummary(userId);

    expect(summary.mostUsed?.name).toBe("Transporte");
  });
});
