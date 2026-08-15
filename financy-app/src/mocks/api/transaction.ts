import { HttpResponse, delay, graphql } from "msw";

import { categoryRef, db } from "@/mocks/data";
import { toPeriod } from "@/mocks/utils";

const api = graphql.link(import.meta.env.VITE_GRAPHQL_URL);

const DEFAULT_PAGE_SIZE = 10;

function withTypename(transaction: Transaction) {
  return {
    __typename: "TransactionModel",
    ...transaction,
    category: { __typename: "CategoryModel", ...transaction.category },
  };
}

export const transactionHandlers = [
  api.query<TransactionsResponse, { data?: TransactionFilters }>(
    "ListTransactions",
    async ({ variables }) => {
      await delay(300);

      const {
        searchQuery = "",
        type = "all",
        categoryId = "all",
        period,
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
      } = variables.data ?? {};

      const filtered = db.transactions.filter((transaction) => {
        const matchesSearch = transaction.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType = type === "all" || transaction.type === type;
        const matchesCategory =
          categoryId === "all" || transaction.category.id === categoryId;
        const matchesPeriod = !period || toPeriod(transaction.date) === period;

        return matchesSearch && matchesType && matchesCategory && matchesPeriod;
      });

      const start = (page - 1) * pageSize;

      return HttpResponse.json({
        data: {
          listTransactions: {
            __typename: "PaginatedTransactionsModel",
            data: filtered.slice(start, start + pageSize).map(withTypename),
            meta: {
              __typename: "PaginationMetaModel",
              page,
              pageSize,
              total: filtered.length,
              totalPages: Math.max(Math.ceil(filtered.length / pageSize), 1),
            },
          },
        },
      });
    },
  ),

  api.query<TransactionPeriodsResponse>("ListTransactionPeriods", async () => {
    await delay(200);

    const periods = [
      ...new Set(
        db.transactions.map((transaction) => toPeriod(transaction.date)),
      ),
    ];

    return HttpResponse.json({ data: { listTransactionPeriods: periods } });
  }),

  api.mutation<CreateTransactionResponse, { data: CreateTransactionRequest }>(
    "CreateTransaction",
    async ({ variables }) => {
      await delay(400);

      const transaction: Transaction = {
        id: crypto.randomUUID(),
        description: variables.data.description,
        date: variables.data.date,
        amount: Math.abs(variables.data.amount),
        type: variables.data.type,
        categoryId: variables.data.categoryId,
        category: categoryRef(variables.data.categoryId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.transactions.unshift(transaction);

      return HttpResponse.json({
        data: { createTransaction: withTypename(transaction) },
      });
    },
  ),

  api.mutation<DeleteTransactionResponse, { id: string }>(
    "DeleteTransaction",
    async ({ variables }) => {
      await delay(300);

      const index = db.transactions.findIndex(
        (transaction) => transaction.id === variables.id,
      );

      if (index < 0) {
        return HttpResponse.json({
          errors: [{ message: "Transação não encontrada!" }],
        });
      }

      db.transactions.splice(index, 1);

      return HttpResponse.json({ data: { deleteTransaction: true } });
    },
  ),
];
