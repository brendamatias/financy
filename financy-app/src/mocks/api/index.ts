import { authHandlers } from "./auth";
import { categoryHandlers } from "./category";
import { dashboardHandlers } from "./dashboard";
import { transactionHandlers } from "./transaction";

export const handlers = [
  ...authHandlers,
  ...categoryHandlers,
  ...dashboardHandlers,
  ...transactionHandlers,
];
