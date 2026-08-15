import { SquarePen, Trash } from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
import { DialogConfirmDelete } from "@/components/dialog-confirm-delete";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { TransactionType } from "@/components/ui/transaction-type";
import { getCategoryIcon } from "@/lib/category-icons";
import { formatDate, formatSignedCurrency } from "@/lib/format";

function TransactionRow({
  transaction,
  onDelete,
  isDeleting,
}: {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4 font-medium">
          <CategoryIcon
            icon={getCategoryIcon(transaction.category.icon)}
            color={transaction.category.color}
          />
          {transaction.description}
        </div>
      </TableCell>

      <TableCell className="text-center text-sm text-gray-600">
        {formatDate(transaction.date)}
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <Tag variant={transaction.category.color}>
            {transaction.category.name}
          </Tag>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <TransactionType variant={transaction.type} />
        </div>
      </TableCell>

      <TableCell className="text-right text-sm font-semibold">
        {formatSignedCurrency(
          transaction.type === "expense"
            ? -transaction.amount
            : transaction.amount,
        )}
      </TableCell>

      <TableCell>
        <div className="flex justify-end gap-2">
          <DialogConfirmDelete
            title="Excluir transação"
            description={`Tem certeza que deseja excluir "${transaction.description}"? Essa ação não pode ser desfeita.`}
            isPending={isDeleting}
            onConfirm={() => onDelete?.(transaction.id)}
          >
            <IconButton
              variant="danger"
              aria-label={`Excluir ${transaction.description}`}
            >
              <Trash />
            </IconButton>
          </DialogConfirmDelete>

          <IconButton aria-label={`Editar ${transaction.description}`}>
            <SquarePen />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TransactionRowSkeleton() {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell>
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-5 w-40" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <Skeleton className="h-5 w-16" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <Skeleton className="h-5 w-20" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-end">
          <Skeleton className="h-5 w-24" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-end gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export { TransactionRow, TransactionRowSkeleton };
