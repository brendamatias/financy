import { HttpResponse, delay } from "msw";

import { db } from "@/mocks/data";
import { api } from "@/mocks/graphql";

function withTypename(category: Category) {
  return { __typename: "CategoryModel", ...category };
}

export const categoryHandlers = [
  api.query<CategoriesResponse>("ListCategories", async () => {
    await delay(300);

    return HttpResponse.json({
      data: { listCategories: db.categories.map(withTypename) },
    });
  }),

  api.query<CategoryResponse, { id: string }>(
    "GetCategory",
    async ({ variables }) => {
      await delay(300);

      const category = db.categories.find((item) => item.id === variables.id);

      if (!category) {
        return HttpResponse.json({
          errors: [{ message: "Categoria não encontrada!" }],
        });
      }

      return HttpResponse.json({
        data: { getCategory: withTypename(category) },
      });
    },
  ),

  api.query<CategoriesSummaryResponse>("GetCategoriesSummary", async () => {
    await delay(300);

    const mostUsed = [...db.categories].sort(
      (a, b) => (b.transactionsCount ?? 0) - (a.transactionsCount ?? 0),
    )[0];

    return HttpResponse.json({
      data: {
        getCategoriesSummary: {
          __typename: "CategoriesSummaryModel",
          categoriesCount: db.categories.length,
          transactionsCount: db.transactions.length,
          mostUsed: mostUsed
            ? {
                __typename: "CategoryModel",
                name: mostUsed.name,
                color: mostUsed.color,
                icon: mostUsed.icon,
              }
            : null,
        },
      },
    });
  }),

  api.mutation<CreateCategoryResponse, { data: CreateCategoryRequest }>(
    "CreateCategory",
    async ({ variables }) => {
      await delay(400);

      const alreadyExists = db.categories.some(
        (category) => category.name === variables.data.name,
      );

      if (alreadyExists) {
        return HttpResponse.json({
          errors: [{ message: "Categoria já existe!" }],
        });
      }

      const category: Category = {
        id: crypto.randomUUID(),
        ...variables.data,
        transactionsCount: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.categories.push(category);

      return HttpResponse.json({
        data: { createCategory: withTypename(category) },
      });
    },
  ),

  api.mutation<
    UpdateCategoryResponse,
    { id: string; data: UpdateCategoryRequest }
  >("UpdateCategory", async ({ variables }) => {
    await delay(400);

    const category = db.categories.find((item) => item.id === variables.id);

    if (!category) {
      return HttpResponse.json({
        errors: [{ message: "Categoria não encontrada!" }],
      });
    }

    Object.assign(category, variables.data, {
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json({
      data: { updateCategory: withTypename(category) },
    });
  }),

  api.mutation<DeleteCategoryResponse, { id: string }>(
    "DeleteCategory",
    async ({ variables }) => {
      await delay(300);

      const index = db.categories.findIndex(
        (category) => category.id === variables.id,
      );

      if (index < 0) {
        return HttpResponse.json({
          errors: [{ message: "Categoria não encontrada!" }],
        });
      }

      db.categories.splice(index, 1);

      return HttpResponse.json({ data: { deleteCategory: true } });
    },
  ),
];
