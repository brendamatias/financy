import { beforeEach, describe, expect, it } from "vitest";

import { prismaClient } from "../../prisma/prisma";
import { AuthService } from "./auth.service";
import { CategoryService } from "./category.service";

const authService = new AuthService();
const categoryService = new CategoryService();

const validCategory = {
  name: "Alimentação",
  description: "Restaurantes e delivery",
  color: "blue",
  icon: "food",
};

let userId: string;
let otherUserId: string;

beforeEach(async () => {
  const owner = await authService.register({
    name: "Conta Teste",
    email: "conta@teste.com",
    password: "12345678",
  });

  const other = await authService.register({
    name: "Outra Conta",
    email: "outra@teste.com",
    password: "12345678",
  });

  userId = owner.user.id;
  otherUserId = other.user.id;
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
        { ...validCategory, color: "roxo" },
        userId,
      ),
    ).rejects.toThrow("Selecione uma cor válida");
  });

  it("rejects an invalid icon", async () => {
    await expect(
      categoryService.createCategory(
        { ...validCategory, icon: "foguete" },
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

  it("returns zero transactions while the transaction model does not exist", async () => {
    await categoryService.createCategory(validCategory, userId);

    const summary = await categoryService.getCategoriesSummary(userId);

    expect(summary.transactionsCount).toBe(0);
  });

  it("returns a category as the most used one", async () => {
    await categoryService.createCategory(validCategory, userId);

    const summary = await categoryService.getCategoriesSummary(userId);

    expect(summary.mostUsed?.name).toBe(validCategory.name);
  });
});
