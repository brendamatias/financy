type TransactionType = "income" | "expense";

interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: Pick<Category, "id" | "name" | "color" | "icon">;
}

interface TransactionFilters extends Pagination {
  type?: TransactionType | "all";
  categoryId?: string | "all";
  period?: string;
}

interface CreateTransactionRequest {
  description: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
}
