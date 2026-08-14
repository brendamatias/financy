import { HttpResponse, delay, http } from "msw";

import { categoryRef, db } from "@/mocks/data";

const DEFAULT_PAGE_SIZE = 10;

function toPeriod(date: string) {
  const [year, month] = date.split("-");
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    new Date(Number(year), Number(month) - 1, 1),
  );

  return `${label[0].toUpperCase()}${label.slice(1)} / ${year}`;
}

export const transactionHandlers = [
  http.get("/api/transactions/periods", async () => {
    await delay(200);

    const periods = [
      ...new Set(
        db.transactions.map((transaction) => toPeriod(transaction.date)),
      ),
    ];

    return HttpResponse.json(periods);
  }),

  http.get("/api/transactions", async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const searchQuery =
      url.searchParams.get("searchQuery")?.toLowerCase() ?? "";
    const type = url.searchParams.get("type") ?? "all";
    const categoryId = url.searchParams.get("categoryId") ?? "all";
    const period = url.searchParams.get("period") ?? "";
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(
      url.searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE,
    );

    const filtered = db.transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchQuery);
      const matchesType = type === "all" || transaction.type === type;
      const matchesCategory =
        categoryId === "all" || transaction.category.id === categoryId;
      const matchesPeriod = !period || toPeriod(transaction.date) === period;

      return matchesSearch && matchesType && matchesCategory && matchesPeriod;
    });

    const start = (page - 1) * pageSize;

    return HttpResponse.json({
      data: filtered.slice(start, start + pageSize),
      meta: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.max(Math.ceil(filtered.length / pageSize), 1),
      },
    } satisfies WithPagination<Transaction>);
  }),

  http.post("/api/transactions", async ({ request }) => {
    await delay(400);

    const input = (await request.json()) as CreateTransactionRequest;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      description: input.description,
      date: input.date,
      amount: Math.abs(input.amount),
      type: input.type,
      category: categoryRef(input.categoryId),
    };

    db.transactions.unshift(transaction);

    return HttpResponse.json(transaction, { status: 201 });
  }),

  http.delete("/api/transactions/:id", async ({ params }) => {
    await delay(300);

    const index = db.transactions.findIndex(
      (transaction) => transaction.id === params.id,
    );

    if (index < 0) {
      return HttpResponse.json(
        { message: "Transação não encontrada." },
        { status: 404 },
      );
    }

    db.transactions.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
