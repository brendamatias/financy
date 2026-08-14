import {
  ArrowUpDown,
  Briefcase,
  Car,
  HeartPulse,
  PiggyBank,
  Plus,
  ShoppingCart,
  SquarePen,
  Tag as TagIcon,
  Ticket,
  Trash,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { DialogCreateCategory } from "@/components/dialog-create-category";
import { CategoryIcon, type CategoryColor } from "@/components/category-icon";
import { TitleSection } from "@/components/title-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

const summary: {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName: string;
}[] = [
  {
    label: "Total de categorias",
    value: "8",
    icon: TagIcon,
    iconClassName: "text-gray-700",
  },
  {
    label: "Total de transações",
    value: "27",
    icon: ArrowUpDown,
    iconClassName: "text-purple-base",
  },
  {
    label: "Categoria mais utilizada",
    value: "Alimentação",
    icon: Utensils,
    iconClassName: "text-blue-base",
  },
];

const categories: {
  id: number;
  name: string;
  description: string;
  color: CategoryColor;
  icon: LucideIcon;
  items: number;
}[] = [
  {
    id: 1,
    name: "Alimentação",
    description: "Restaurantes, delivery e refeições",
    color: "blue",
    icon: Utensils,
    items: 12,
  },
  {
    id: 2,
    name: "Entretenimento",
    description: "Cinema, jogos e lazer",
    color: "pink",
    icon: Ticket,
    items: 2,
  },
  {
    id: 3,
    name: "Investimento",
    description: "Aplicações e retornos financeiros",
    color: "green",
    icon: PiggyBank,
    items: 1,
  },
  {
    id: 4,
    name: "Mercado",
    description: "Compras de supermercado e mantimentos",
    color: "orange",
    icon: ShoppingCart,
    items: 3,
  },
  {
    id: 5,
    name: "Salário",
    description: "Renda mensal e bonificações",
    color: "green",
    icon: Briefcase,
    items: 3,
  },
  {
    id: 6,
    name: "Saúde",
    description: "Medicamentos, consultas e exames",
    color: "red",
    icon: HeartPulse,
    items: 0,
  },
  {
    id: 7,
    name: "Transporte",
    description: "Gasolina, transporte público e viagens",
    color: "purple",
    icon: Car,
    items: 8,
  },
  {
    id: 8,
    name: "Utilidades",
    description: "Energia, água, internet e telefone",
    color: "yellow",
    icon: Zap,
    items: 7,
  },
];

function Categories() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-base text-gray-600">
            Organize suas transações por categorias
          </p>
        </div>

        <DialogCreateCategory>
          <Button size="sm">
            <Plus />
            Nova categoria
          </Button>
        </DialogCreateCategory>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="flex gap-4">
            <div className="h-8 w-8 flex items-center justify-center">
              <item.icon className={cn("size-6", item.iconClassName)} />
            </div>

            <div className="flex flex-col gap-2">
              <strong className="text-[28px] leading-8 font-bold text-gray-800">
                {item.value}
              </strong>
              <TitleSection text={item.label} />
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.id} className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <CategoryIcon icon={category.icon} color={category.color} />

              <div className="flex items-center gap-2">
                <IconButton
                  variant="danger"
                  aria-label={`Excluir categoria ${category.name}`}
                >
                  <Trash />
                </IconButton>

                <IconButton aria-label={`Editar categoria ${category.name}`}>
                  <SquarePen />
                </IconButton>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <strong className="text-base font-semibold text-gray-800">
                {category.name}
              </strong>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Tag variant={category.color}>{category.name}</Tag>

              <span className="text-sm text-gray-600">
                {category.items} {category.items === 1 ? "item" : "itens"}
              </span>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

export { Categories };
