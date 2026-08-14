import {
  BriefcaseBusiness,
  CarFront,
  ChevronLeft,
  ChevronRight,
  PiggyBank,
  Plus,
  Search,
  ShoppingCart,
  SquarePen,
  Ticket,
  Trash,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
import { DialogCreateTransaction } from "@/components/dialog-create-transaction";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { InputField } from "@/components/ui/input-field";
import { PaginationButton } from "@/components/ui/pagination-button";
import { SelectField } from "@/components/ui/select-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { TransactionType } from "@/components/ui/transaction-type";

const types = ["Todos", "Entrada", "Saída"];

const categoryOptions = [
  "Todas",
  "Alimentação",
  "Transporte",
  "Mercado",
  "Entretenimento",
  "Utilidades",
  "Salário",
  "Investimento",
];

const periods = ["Novembro / 2025", "Outubro / 2025", "Setembro / 2025"];

const transactions: {
  id: number;
  description: string;
  date: string;
  category: string;
  color: CategoryColor;
  icon: LucideIcon;
  type: "income" | "expense";
  amount: string;
}[] = [
  {
    id: 1,
    description: "Jantar no Restaurante",
    date: "30/11/25",
    category: "Alimentação",
    color: "blue",
    icon: Utensils,
    type: "expense",
    amount: "- R$ 89,50",
  },
  {
    id: 2,
    description: "Posto de Gasolina",
    date: "29/11/25",
    category: "Transporte",
    color: "purple",
    icon: CarFront,
    type: "expense",
    amount: "- R$ 100,00",
  },
  {
    id: 3,
    description: "Compras no Mercado",
    date: "28/11/25",
    category: "Mercado",
    color: "orange",
    icon: ShoppingCart,
    type: "expense",
    amount: "- R$ 156,80",
  },
  {
    id: 4,
    description: "Retorno de Investimento",
    date: "26/11/25",
    category: "Investimento",
    color: "green",
    icon: PiggyBank,
    type: "income",
    amount: "+ R$ 340,25",
  },
  {
    id: 5,
    description: "Aluguel",
    date: "26/11/25",
    category: "Utilidades",
    color: "yellow",
    icon: Zap,
    type: "expense",
    amount: "- R$ 1.700,00",
  },
  {
    id: 6,
    description: "Freelance",
    date: "24/11/25",
    category: "Salário",
    color: "green",
    icon: BriefcaseBusiness,
    type: "income",
    amount: "+ R$ 2.500,00",
  },
  {
    id: 7,
    description: "Compras Jantar",
    date: "22/11/25",
    category: "Mercado",
    color: "orange",
    icon: ShoppingCart,
    type: "expense",
    amount: "- R$ 150,00",
  },
  {
    id: 8,
    description: "Cinema",
    date: "18/12/25",
    category: "Entretenimento",
    color: "pink",
    icon: Ticket,
    type: "expense",
    amount: "- R$ 88,00",
  },
];

function Transactions() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-base text-gray-600">
            Gerencie todas as suas transações financeiras
          </p>
        </div>

        <DialogCreateTransaction>
          <Button size="sm">
            <Plus />
            Nova transação
          </Button>
        </DialogCreateTransaction>
      </div>

      <Card className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 py-5">
        <InputField
          label="Buscar"
          name="search"
          placeholder="Buscar por descrição"
          icon={<Search />}
        />

        <SelectField
          label="Tipo"
          name="type"
          items={types}
          defaultValue={types[0]}
        />

        <SelectField
          label="Categoria"
          name="category"
          items={categoryOptions}
          defaultValue={categoryOptions[0]}
        />

        <SelectField
          label="Período"
          name="period"
          items={periods}
          defaultValue={periods[0]}
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center font-medium gap-4">
                    <CategoryIcon
                      icon={transaction.icon}
                      color={transaction.color}
                    />
                    {transaction.description}
                  </div>
                </TableCell>

                <TableCell className="text-center text-sm text-gray-600">
                  {transaction.date}
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <Tag variant={transaction.color}>
                      {transaction.category}
                    </Tag>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <TransactionType variant={transaction.type} />
                  </div>
                </TableCell>

                <TableCell className="text-right font-semibold text-sm">
                  {transaction.amount}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <IconButton
                      variant="danger"
                      aria-label={`Excluir ${transaction.description}`}
                    >
                      <Trash />
                    </IconButton>

                    <IconButton
                      aria-label={`Editar ${transaction.description}`}
                    >
                      <SquarePen />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <span className="text-sm text-gray-700">
            <strong className="font-medium">1</strong> a{" "}
            <strong className="font-medium">10</strong> |{" "}
            <strong className="font-medium">27</strong> resultados
          </span>

          <div className="flex items-center gap-2">
            <PaginationButton aria-label="Página anterior" disabled>
              <ChevronLeft />
            </PaginationButton>

            <PaginationButton isActive>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>

            <PaginationButton aria-label="Próxima página">
              <ChevronRight />
            </PaginationButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

export { Transactions };
