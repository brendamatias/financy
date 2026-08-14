import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

const transactionTypeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-4",
  {
    variants: {
      variant: {
        income: "text-green-dark [&>svg]:text-green-base",
        expense: "text-red-dark [&>svg]:text-red-base",
      },
    },
    defaultVariants: {
      variant: "income",
    },
  },
);

const labels = {
  income: "Entrada",
  expense: "Saída",
} as const;

const icons = {
  income: CircleArrowUp,
  expense: CircleArrowDown,
} as const;

function TransactionType({
  className,
  variant = "income",
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof transactionTypeVariants>) {
  const type = variant ?? "income";
  const Icon = icons[type];

  return (
    <span
      data-slot="transaction-type"
      data-variant={type}
      className={cn(transactionTypeVariants({ variant, className }))}
      {...props}
    >
      <Icon />
      {children ?? labels[type]}
    </span>
  );
}

export { TransactionType, transactionTypeVariants };
