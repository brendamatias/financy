import {
  ArrowUpDown,
  Plus,
  SquarePen,
  Tag as TagIcon,
  Trash,
} from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
import { DialogCreateCategory } from "@/components/dialog-create-category";
import { TitleSection } from "@/components/title-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import {
  useCategories,
  useCategoriesSummary,
  useDeleteCategory,
} from "@/services";

function Categories() {
  const { data: categories, isLoading } = useCategories();
  const { data: summary } = useCategoriesSummary();
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  const mostUsedIcon = summary?.mostUsed
    ? getCategoryIcon(summary.mostUsed.icon)
    : TagIcon;

  const summaryCards = [
    {
      label: "Total de categorias",
      value: summary?.categoriesCount ?? 0,
      icon: TagIcon,
      iconClassName: "text-gray-700",
    },
    {
      label: "Total de transações",
      value: summary?.transactionsCount ?? 0,
      icon: ArrowUpDown,
      iconClassName: "text-purple-base",
    },
    {
      label: "Categoria mais utilizada",
      value: summary?.mostUsed?.name ?? "-",
      icon: mostUsedIcon,
      iconClassName: "text-blue-base",
    },
  ];

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
        {summaryCards.map((item) => (
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

      {isLoading ? (
        <p className="text-base text-gray-600">Carregando categorias...</p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {categories?.map((category) => (
            <Card key={category.id} className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <CategoryIcon
                  icon={getCategoryIcon(category.icon)}
                  color={category.color}
                />

                <div className="flex items-center gap-2">
                  <IconButton
                    variant="danger"
                    disabled={isPending}
                    onClick={() => deleteCategory(category.id)}
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
                  {category.transactionsCount}{" "}
                  {category.transactionsCount === 1 ? "item" : "itens"}
                </span>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}

export { Categories };
