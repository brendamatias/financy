import {
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Plus,
  Wallet,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import { CategoryIcon } from "@/components/category-icon";
import { DialogCreateTransaction } from "@/components/dialog-create-transaction";
import { SummaryCard, SummaryCardSkeleton } from "@/components/summary-card";
import { TitleSection } from "@/components/title-section";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "@/components/ui/tag";
import { getCategoryIcon } from "@/lib/category-icons";
import { formatCurrency, formatDate, formatSignedCurrency } from "@/lib/format";
import {
  useCategories,
  useDashboardSummary,
  useTransactions,
} from "@/services";

const RECENT_TRANSACTIONS = 5;
const RECENT_CATEGORIES = 5;

function SectionHeader({
  title,
  action,
  to,
}: {
  title: string;
  action: string;
  to: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-5">
      <TitleSection text={title} />

      <Link asChild>
        <RouterLink to={to}>
          {action}
          <ChevronRight />
        </RouterLink>
      </Link>
    </div>
  );
}

function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: transactions, isLoading: isLoadingTransactions } =
    useTransactions({ page: 1, pageSize: RECENT_TRANSACTIONS });
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const summaryCards = [
    {
      label: "Saldo total",
      value: formatCurrency(summary?.balance ?? 0),
      icon: Wallet,
      iconClassName: "text-purple-base",
    },
    {
      label: "Receitas do mês",
      value: formatCurrency(summary?.income ?? 0),
      icon: CircleArrowUp,
      iconClassName: "text-green-base",
    },
    {
      label: "Despesas do mês",
      value: formatCurrency(summary?.expenses ?? 0),
      icon: CircleArrowDown,
      iconClassName: "text-red-base",
    },
  ];

  const topCategories = [...(categories ?? [])]
    .sort((a, b) => b.total - a.total)
    .slice(0, RECENT_CATEGORIES);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-6 md:grid-cols-3">
        {isLoadingSummary
          ? Array.from({ length: 3 }, (_, index) => (
              <SummaryCardSkeleton key={index} />
            ))
          : summaryCards.map((item) => (
              <SummaryCard
                key={item.label}
                label={item.label}
                value={item.value}
                icon={item.icon}
                iconClassName={item.iconClassName}
              />
            ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="flex flex-col p-0">
          <SectionHeader
            title="Transações recentes"
            action="Ver todas"
            to="/transactions"
          />

          <ul className="flex flex-col">
            {isLoadingTransactions
              ? Array.from({ length: RECENT_TRANSACTIONS }, (_, index) => (
                  <li
                    key={index}
                    className="flex h-20 items-center gap-4 border-b border-gray-200 px-6"
                  >
                    <Skeleton className="size-10 rounded-lg" />

                    <div className="flex flex-1 flex-col gap-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-20" />
                    </div>

                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-5 w-28" />
                  </li>
                ))
              : transactions?.data.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex h-20 items-center gap-4 border-b border-gray-200 px-6"
                  >
                    <CategoryIcon
                      icon={getCategoryIcon(transaction.category.icon)}
                      color={transaction.category.color}
                    />

                    <div className="flex flex-1 flex-col">
                      <span className="text-base font-medium text-gray-800">
                        {transaction.description}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </span>
                    </div>

                    <Tag variant={transaction.category.color}>
                      {transaction.category.name}
                    </Tag>

                    <div className="flex w-40 items-center justify-end gap-2">
                      <strong className="text-sm font-semibold text-gray-800">
                        {formatSignedCurrency(
                          transaction.type === "expense"
                            ? -transaction.amount
                            : transaction.amount,
                        )}
                      </strong>

                      {transaction.type === "income" ? (
                        <CircleArrowUp className="size-4 text-green-base" />
                      ) : (
                        <CircleArrowDown className="size-4 text-red-base" />
                      )}
                    </div>
                  </li>
                ))}
          </ul>

          <div className="my-5 flex items-center justify-center">
            <DialogCreateTransaction>
              <Link asChild>
                <button type="button">
                  <Plus className="size-5" />
                  Nova transação
                </button>
              </Link>
            </DialogCreateTransaction>
          </div>
        </Card>

        <Card className="flex h-fit flex-col p-0">
          <SectionHeader
            title="Categorias"
            action="Gerenciar"
            to="/categories"
          />

          <ul className="flex flex-col gap-4 p-6">
            {isLoadingCategories
              ? Array.from({ length: RECENT_CATEGORIES }, (_, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="ml-auto h-4 w-14" />
                    <Skeleton className="h-5 w-20" />
                  </li>
                ))
              : topCategories.map((category) => (
                  <li key={category.id} className="flex items-center gap-4">
                    <Tag variant={category.color}>{category.name}</Tag>

                    <span className="ml-auto text-sm text-gray-600">
                      {category.transactionsCount}{" "}
                      {category.transactionsCount === 1 ? "item" : "itens"}
                    </span>

                    <strong className="text-sm font-semibold text-gray-800">
                      {formatCurrency(category.total)}
                    </strong>
                  </li>
                ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

export { Dashboard };
