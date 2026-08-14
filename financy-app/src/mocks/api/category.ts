import { HttpResponse, delay, http } from "msw";

import { db } from "@/mocks/data";

export const categoryHandlers = [
  http.get("/api/categories", async () => {
    await delay(300);

    return HttpResponse.json(db.categories);
  }),

  http.get("/api/categories/summary", async () => {
    await delay(300);

    const mostUsed = [...db.categories].sort(
      (a, b) => b.transactionsCount - a.transactionsCount,
    )[0];

    return HttpResponse.json({
      categoriesCount: db.categories.length,
      transactionsCount: db.categories.reduce(
        (total, category) => total + category.transactionsCount,
        0,
      ),
      mostUsed: mostUsed
        ? { name: mostUsed.name, color: mostUsed.color, icon: mostUsed.icon }
        : null,
    } satisfies CategoriesSummary);
  }),

  http.post("/api/categories", async ({ request }) => {
    await delay(400);

    const input = (await request.json()) as CreateCategoryRequest;

    const category: Category = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      color: input.color,
      icon: input.icon,
      transactionsCount: 0,
    };

    db.categories.push(category);

    return HttpResponse.json(category, { status: 201 });
  }),

  http.delete("/api/categories/:id", async ({ params }) => {
    await delay(300);

    const index = db.categories.findIndex(
      (category) => category.id === params.id,
    );

    if (index < 0) {
      return HttpResponse.json(
        { message: "Categoria não encontrada." },
        { status: 404 },
      );
    }

    db.categories.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
