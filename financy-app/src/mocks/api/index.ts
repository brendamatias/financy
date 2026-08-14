import { categoryHandlers } from "./category";
import { dashboardHandlers } from "./dashboard";
import { transactionHandlers } from "./transaction";

export const handlers = [
  ...categoryHandlers,
  ...dashboardHandlers,
  ...transactionHandlers,
];
