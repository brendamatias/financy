import { useMutation, useQuery } from "@apollo/client/react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import * as React from "react";

import { DialogTransactionForm } from "@/components/dialog-transaction-form";
import {
  TransactionRow,
  TransactionRowSkeleton,
} from "@/components/transaction-row";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { PaginationButton } from "@/components/ui/pagination-button";
import { SelectField } from "@/components/ui/select-field";
import { formatPeriod } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DELETE_TRANSACTION,
  LIST_CATEGORIES,
  LIST_TRANSACTIONS,
  LIST_TRANSACTION_PERIODS,
  REFETCH_TRANSACTIONS,
} from "@/lib/graphql";

const PAGE_SIZE = 10;

const typeOptions = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Entrada" },
  { value: "expense", label: "Saída" },
];
function Transactions() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [type, setType] = React.useState<TransactionFilters["type"]>("all");
  const [categoryId, setCategoryId] = React.useState("all");
  const [period, setPeriod] = React.useState("");
  const [page, setPage] = React.useState(1);

  const { data: categoriesData } = useQuery(LIST_CATEGORIES);
  const categories = categoriesData?.listCategories;
  const { data: periodsData } = useQuery(LIST_TRANSACTION_PERIODS);
  const { data, loading } = useQuery(LIST_TRANSACTIONS, {
    fetchPolicy: "cache-and-network",
    variables: {
      data: {
        page,
        pageSize: PAGE_SIZE,
        searchQuery,
        type,
        categoryId,
        period: period || undefined,
      },
    },
  });

  const isLoading = loading && !data;

  const [deleteTransaction, { loading: isPending }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: REFETCH_TRANSACTIONS,
      onCompleted: () => toast.success("Transação excluída com sucesso."),
      onError: (error) => toast.error(error.message),
    },
  );

  const periods = periodsData?.listTransactionPeriods;
  const transactions = data?.listTransactions.data ?? [];
  const total = data?.listTransactions.meta.total ?? 0;
  const totalPages = data?.listTransactions.meta.totalPages ?? 1;
  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  const categoryOptions = [
    { value: "all", label: "Todas" },
    ...(categories ?? []).map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const periodOptions = [
    { value: "", label: "Todos os períodos" },
    ...(periods ?? []).map((item) => ({
      value: item,
      label: formatPeriod(item),
    })),
  ];

  function updateFilter(update: () => void) {
    update();
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-base text-gray-600">
            Gerencie todas as suas transações financeiras
          </p>
        </div>

        <DialogTransactionForm>
          <Button size="sm">
            <Plus />
            Nova transação
          </Button>
        </DialogTransactionForm>
      </div>

      <Card className="grid gap-4 py-5 sm:grid-cols-2 md:grid-cols-4">
        <InputField
          label="Buscar"
          name="search"
          placeholder="Buscar por descrição"
          icon={<Search />}
          value={searchQuery}
          onChange={(event) =>
            updateFilter(() => setSearchQuery(event.target.value))
          }
        />

        <SelectField
          label="Tipo"
          items={typeOptions}
          value={type}
          onValueChange={(value) =>
            updateFilter(() => setType(value as TransactionFilters["type"]))
          }
        />

        <SelectField
          label="Categoria"
          items={categoryOptions}
          value={categoryId}
          onValueChange={(value) => updateFilter(() => setCategoryId(value))}
        />

        <SelectField
          label="Período"
          placeholder="Todos os períodos"
          items={periodOptions}
          value={period}
          onValueChange={(value) => updateFilter(() => setPeriod(value))}
        />
      </Card>

      <Card className="flex flex-col p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Descrição</TableHead>
              <TableHead className="text-center">Data</TableHead>
              <TableHead className="text-center">Categoria</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }, (_, index) => (
                <TransactionRowSkeleton key={index} />
              ))
            ) : transactions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-gray-600">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={(id) => deleteTransaction({ variables: { id } })}
                  isDeleting={isPending}
                />
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <span className="text-sm text-gray-700">
            <strong className="font-medium">{firstItem}</strong> a{" "}
            <strong className="font-medium">{lastItem}</strong> |{" "}
            <strong className="font-medium">{total}</strong> resultados
          </span>

          <div className="flex items-center gap-2">
            <PaginationButton
              aria-label="Página anterior"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft />
            </PaginationButton>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (item) => (
                <PaginationButton
                  key={item}
                  isActive={item === page}
                  onClick={() => setPage(item)}
                >
                  {item}
                </PaginationButton>
              ),
            )}

            <PaginationButton
              aria-label="Próxima página"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight />
            </PaginationButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

export { Transactions };
