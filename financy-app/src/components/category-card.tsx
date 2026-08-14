import { SquarePen, Trash } from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "@/components/ui/tag";
import { getCategoryIcon } from "@/lib/category-icons";

function CategoryCard({
  category,
  onDelete,
  isDeleting,
}: {
  category: Category;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <CategoryIcon
          icon={getCategoryIcon(category.icon)}
          color={category.color}
        />

        <div className="flex items-center gap-2">
          <IconButton
            variant="danger"
            disabled={isDeleting}
            onClick={() => onDelete?.(category.id)}
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
  );
}

function CategoryCardSkeleton() {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="size-10 rounded-lg" />

        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-full" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-5 w-14" />
      </div>
    </Card>
  );
}

export { CategoryCard, CategoryCardSkeleton };
