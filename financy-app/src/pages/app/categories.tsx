import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpDown, Plus, Tag as TagIcon } from "lucide-react";
import toast from "react-hot-toast";

import { CategoryCard, CategoryCardSkeleton } from "@/components/category-card";
import { EmptyList } from "@/components/empty-list";
import { DialogCategoryForm } from "@/components/dialog-category-form";
import { SummaryCard, SummaryCardSkeleton } from "@/components/summary-card";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/lib/category-icons";
import {
  DELETE_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORIES_SUMMARY,
  REFETCH_CATEGORIES,
} from "@/services";

function Categories() {
  const { data, loading: isLoading } = useQuery(GET_CATEGORIES);
  const { data: summaryData, loading: isLoadingSummary } = useQuery(
    GET_CATEGORIES_SUMMARY,
  );

  const [deleteCategory, { loading: isPending }] = useMutation(
    DELETE_CATEGORY,
    {
      refetchQueries: REFETCH_CATEGORIES,
      onCompleted: () => toast.success("Categoria excluída com sucesso."),
      onError: (error) => toast.error(error.message),
    },
  );

  const categories = data?.getCategories;
  const summary = summaryData?.getCategoriesSummary;

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

        <DialogCategoryForm>
          <Button size="sm">
            <Plus />
            Nova categoria
          </Button>
        </DialogCategoryForm>
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

      {!isLoading && categories?.length === 0 ? (
        <EmptyList
          icon={TagIcon}
          title="Nenhuma categoria por aqui"
          description="Crie sua primeira categoria para organizar suas transações."
          action={
            <DialogCategoryForm>
              <Button size="sm">
                <Plus />
                Nova categoria
              </Button>
            </DialogCategoryForm>
          }
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }, (_, index) => (
                <CategoryCardSkeleton key={index} />
              ))
            : categories?.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onDelete={(id) => deleteCategory({ variables: { id } })}
                  isDeleting={isPending}
                />
              ))}
        </section>
      )}
    </div>
  );
}

export { Categories };
