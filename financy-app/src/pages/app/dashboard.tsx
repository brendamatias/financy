import {
  BriefcaseBusiness,
  CarFront,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  PiggyBank,
  Plus,
  ShoppingCart,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import { CategoryIcon, type CategoryColor } from "@/components/category-icon";
import { TitleSection } from "@/components/title-section";
import { DialogCreateTransaction } from "@/components/dialog-create-transaction";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

const summary = [
  {
    label: "Saldo total",
    value: "R$ 12.847,32",
    icon: Wallet,
    iconClassName: "text-purple-base",
  },
  {
    label: "Receitas do mês",
    value: "R$ 4.250,00",
    icon: CircleArrowUp,
    iconClassName: "text-green-base",
  },
  {
    label: "Despesas do mês",
    value: "R$ 2.180,45",
    icon: CircleArrowDown,
    iconClassName: "text-red-base",
  },
];

const transactions: {
  id: number;
  title: string;
  date: string;
  category: string;
  color: CategoryColor;
  amount: string;
  type: "income" | "expense";
  icon: LucideIcon;
}[] = [
  {
    id: 1,
    title: "Pagamento de Salário",
    date: "01/12/25",
    category: "Receita",
    color: "green",
    amount: "+ R$ 4.250,00",
    type: "income",
    icon: BriefcaseBusiness,
  },
  {
    id: 2,
    title: "Jantar no Restaurante",
    date: "30/11/25",
    category: "Alimentação",
    color: "blue",
    amount: "- R$ 89,50",
    type: "expense",
    icon: Utensils,
  },
  {
    id: 3,
    title: "Posto de Gasolina",
    date: "29/11/25",
    category: "Transporte",
    color: "purple",
    amount: "- R$ 100,00",
    type: "expense",
    icon: CarFront,
  },
  {
    id: 4,
    title: "Compras no Mercado",
    date: "28/11/25",
    category: "Mercado",
    color: "orange",
    amount: "- R$ 156,80",
    type: "expense",
    icon: ShoppingCart,
  },
  {
    id: 5,
    title: "Retorno de Investimento",
    date: "26/11/25",
    category: "Investimento",
    color: "green",
    amount: "+ R$ 340,25",
    type: "income",
    icon: PiggyBank,
  },
];

const categories: {
  id: number;
  name: string;
  color: CategoryColor;
  items: number;
  total: string;
}[] = [
  {
    id: 1,
    name: "Alimentação",
    color: "blue",
    items: 12,
    total: "R$ 542,30",
  },
  {
    id: 2,
    name: "Transporte",
    color: "purple",
    items: 8,
    total: "R$ 385,50",
  },
  { id: 3, name: "Mercado", color: "orange", items: 3, total: "R$ 298,75" },
  {
    id: 4,
    name: "Entretenimento",
    color: "pink",
    items: 2,
    total: "R$ 186,20",
  },
  {
    id: 5,
    name: "Utilidades",
    color: "yellow",
    items: 7,
    total: "R$ 245,80",
  },
];

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
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-6 md:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <item.icon className={cn("size-5", item.iconClassName)} />
              <TitleSection text={item.label} />
            </div>

            <strong className="text-[28px] leading-8 font-bold text-gray-800">
              {item.value}
            </strong>
          </Card>
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
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center gap-4 border-b border-gray-200 px-6 h-20"
              >
                <CategoryIcon
                  icon={transaction.icon}
                  color={transaction.color}
                />

                <div className="flex flex-1 flex-col">
                  <span className="text-base font-medium text-gray-800">
                    {transaction.title}
                  </span>
                  <span className="text-sm text-gray-600">
                    {transaction.date}
                  </span>
                </div>

                <Tag variant={transaction.color}>{transaction.category}</Tag>

                <div className="flex w-40 items-center justify-end gap-2">
                  <strong className="text-sm font-semibold text-gray-800">
                    {transaction.amount}
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

          <div className="flex items-center justify-center my-5">
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
            {categories.map((category) => (
              <li key={category.id} className="flex items-center gap-4">
                <Tag variant={category.color}>{category.name}</Tag>

                <span className="ml-auto text-sm text-gray-600">
                  {category.items} itens
                </span>

                <strong className="text-sm font-semibold text-gray-800">
                  {category.total}
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
