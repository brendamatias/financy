import { authHandlers } from "./auth";
import { categoryHandlers } from "./category";
import { dashboardHandlers } from "./dashboard";
import { transactionHandlers } from "./transaction";
import { userHandlers } from "./user";

const useGraphqlMock = import.meta.env.VITE_GRAPHQL_MOCK === "true";

export const handlers = [
  ...(useGraphqlMock
    ? [
        ...authHandlers,
        ...categoryHandlers,
        ...dashboardHandlers,
        ...transactionHandlers,
      ]
    : []),
  ...userHandlers,
];
