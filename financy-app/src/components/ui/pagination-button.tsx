import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const paginationButtonVariants = cva(
  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:size-4",
  {
    variants: {
      isActive: {
        true: "border-transparent bg-brand-base text-white",
        false: "border-gray-300 bg-background text-gray-700 hover:bg-gray-200",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

function PaginationButton({
  className,
  isActive = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof paginationButtonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="pagination-button"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(paginationButtonVariants({ isActive, className }))}
      {...props}
    />
  );
}

export { PaginationButton, paginationButtonVariants };
