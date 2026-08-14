import { HttpResponse, delay, http } from "msw";

import { db } from "@/mocks/data";

function withStats(category: CategoryRecord): Category {
  const transactions = db.transactions.filter(
    (transaction) => transaction.category.id === category.id,
  );

  return {
    ...category,
    transactionsCount: transactions.length,
    total: transactions.reduce((total, item) => total + item.amount, 0),
  };
}

export const categoryHandlers = [
  http.get("/api/categories", async () => {
    await delay(300);

    return HttpResponse.json(db.categories.map(withStats));
  }),

  http.get("/api/categories/summary", async () => {
    await delay(300);

    const categories = db.categories.map(withStats);

    const mostUsed = [...categories].sort(
      (a, b) => b.transactionsCount - a.transactionsCount,
    )[0];

    return HttpResponse.json({
      categoriesCount: categories.length,
      transactionsCount: db.transactions.length,
      mostUsed: mostUsed
        ? { name: mostUsed.name, color: mostUsed.color, icon: mostUsed.icon }
        : null,
    } satisfies CategoriesSummary);
  }),

  http.post("/api/categories", async ({ request }) => {
    await delay(400);

    const input = (await request.json()) as CreateCategoryRequest;

    const category: CategoryRecord = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      color: input.color,
      icon: input.icon,
    };

    db.categories.push(category);

    return HttpResponse.json(withStats(category), { status: 201 });
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
