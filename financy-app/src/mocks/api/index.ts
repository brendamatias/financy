import { categoryHandlers } from "./category";
import { transactionHandlers } from "./transaction";

export const handlers = [...categoryHandlers, ...transactionHandlers];
