import { ArrowUpDown, Plus, Tag as TagIcon } from "lucide-react";

import { CategoryCard, CategoryCardSkeleton } from "@/components/category-card";
import { DialogCreateCategory } from "@/components/dialog-create-category";
import { SummaryCard, SummaryCardSkeleton } from "@/components/summary-card";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/lib/category-icons";
import {
  useCategories,
  useCategoriesSummary,
  useDeleteCategory,
} from "@/services";

function Categories() {
  const { data: categories, isLoading } = useCategories();
  const { data: summary, isLoading: isLoadingSummary } = useCategoriesSummary();
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

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }, (_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : categories?.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onDelete={deleteCategory}
                isDeleting={isPending}
              />
            ))}
      </section>
    </div>
  );
}

export { Categories };
