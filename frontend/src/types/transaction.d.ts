type TransactionType = "income" | "expense";

interface Transaction {
  __typename?: string;
  id: string;
  description: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  category: Pick<Category, "__typename" | "id" | "name" | "color" | "icon">;
  createdAt: string;
  updatedAt: string;
}

interface TransactionFilters {
  searchQuery?: string;
  type?: TransactionType | "all";
  categoryId?: string | "all";
  period?: string;
  page?: number;
  pageSize?: number;
}

interface CreateTransactionRequest {
  description: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
}

interface UpdateTransactionRequest {
  description?: string;
  date?: string;
  amount?: number;
  type?: TransactionType;
  categoryId?: string;
}

interface TransactionsResponse {
  listTransactions: WithPagination<Transaction>;
}

interface TransactionPeriodsResponse {
  listTransactionPeriods: string[];
}

interface CreateTransactionResponse {
  createTransaction: Transaction;
}

interface UpdateTransactionResponse {
  updateTransaction: Transaction;
}

interface GetTransactionResponse {
  getTransaction: Transaction;
}

interface DeleteTransactionResponse {
  deleteTransaction: boolean;
}
