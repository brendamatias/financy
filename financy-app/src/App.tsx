import { Mail, Tag as TagIcon, Trash2, UserPlus } from "lucide-react";

import { CategoryCard, CategoryCardSkeleton } from "@/components/category-card";
import { SummaryCard, SummaryCardSkeleton } from "@/components/summary-card";
import {
  TransactionRow,
  TransactionRowSkeleton,
} from "@/components/transaction-row";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { InputField } from "@/components/ui/input-field";
import { Link } from "@/components/ui/link";
import { PaginationButton } from "@/components/ui/pagination-button";
import { Tag } from "@/components/ui/tag";
import { TransactionType } from "@/components/ui/transaction-type";

const variants = ["solid", "outline"] as const;

const sizes = ["md", "sm"] as const;

const tagVariantList = [
  "gray",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
] as const;

const exampleCategory: Category = {
  id: "example",
  name: "Alimentação",
  description: "Restaurantes, delivery e refeições",
  color: "blue",
  icon: "food",
  transactionsCount: 12,
};

const exampleTransaction: Transaction = {
  id: "example",
  description: "Jantar no Restaurante",
  date: "2025-11-30",
  amount: 89.5,
  type: "expense",
  category: {
    id: "1",
    name: "Alimentação",
    color: "blue",
    icon: "food",
  },
};

function App() {
  return (
    <main className="flex flex-col gap-10 text-left">
      <h1 className="text-3xl font-medium">Skeleton</h1>

      <section className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <CategoryCard category={exampleCategory} />
        <CategoryCardSkeleton />

        <SummaryCard
          label="Total de categorias"
          value="8"
          icon={TagIcon}
          iconClassName="text-gray-700"
        />
        <SummaryCardSkeleton />
      </section>

      <Card className="p-0">
        <Table>
          <TableBody>
            <TransactionRow transaction={exampleTransaction} />
            <TransactionRowSkeleton />
          </TableBody>
        </Table>
      </Card>

      <h1 className="text-3xl font-medium">Button</h1>

      {sizes.map((size) => (
        <section key={size} className="flex flex-col gap-4">
          <h2 className="text-sm tracking-widest text-gray-500 uppercase">
            {size}
          </h2>

          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-500">{variant}</span>

              <Button variant={variant} size={size}>
                <UserPlus />
                Label
              </Button>

              <Button variant={variant} size={size} disabled>
                <UserPlus />
                Label
              </Button>

              <Button variant={variant} size={size}>
                Label
              </Button>
            </div>
          ))}
        </section>
      ))}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm tracking-widest text-gray-500 uppercase">
          Icon Button
        </h2>

        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-gray-500">default</span>

          <IconButton aria-label="Adicionar">
            <UserPlus />
          </IconButton>
          <IconButton disabled aria-label="Adicionar">
            <UserPlus />
          </IconButton>
        </div>

        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-gray-500">danger</span>

          <IconButton variant="danger" aria-label="Excluir">
            <Trash2 />
          </IconButton>
          <IconButton variant="danger" disabled aria-label="Excluir">
            <Trash2 />
          </IconButton>
        </div>
      </section>

      <h1 className="text-3xl font-medium">Input</h1>

      <section className="flex max-w-sm flex-col gap-6">
        <InputField
          label="Label"
          helperText="Helper"
          placeholder="Placeholder"
          icon={<Mail />}
        />

        <InputField
          label="Label"
          helperText="Helper"
          placeholder="Placeholder"
          defaultValue="Text"
          icon={<Mail />}
        />

        <InputField
          label="Label"
          placeholder="Placeholder"
          defaultValue="Text"
          icon={<Mail />}
          error="Mensagem de erro"
        />

        <InputField
          label="Label"
          helperText="Helper"
          placeholder="Text"
          icon={<Mail />}
          disabled
        />
      </section>

      <h1 className="text-3xl font-medium">Link</h1>

      <section className="flex items-center gap-6">
        <Link href="#">Label</Link>
        <Link href="#" aria-disabled>
          Label
        </Link>
      </section>

      <h1 className="text-3xl font-medium">Pagination Button</h1>

      <section className="flex items-center gap-4">
        <PaginationButton>1</PaginationButton>
        <PaginationButton isActive>1</PaginationButton>
        <PaginationButton disabled>1</PaginationButton>
      </section>

      <h1 className="text-3xl font-medium">Tag</h1>

      <section className="flex flex-wrap items-center gap-4">
        {tagVariantList.map((variant) => (
          <Tag key={variant} variant={variant}>
            Label
          </Tag>
        ))}
      </section>

      <h1 className="text-3xl font-medium">Type</h1>

      <section className="flex flex-col items-start gap-4">
        <TransactionType variant="income" />
        <TransactionType variant="expense" />
      </section>
    </main>
  );
}

export default App;
