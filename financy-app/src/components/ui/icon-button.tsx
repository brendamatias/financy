import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  cn(
    buttonVariants({ variant: null, size: null }),
    "size-8 border-gray-300 bg-white [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        default: "text-gray-700 hover:bg-gray-200",
        danger: "text-danger hover:bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function IconButton({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants> & {
    asChild?: boolean;
    "aria-label": string;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="icon-button"
      data-variant={variant}
      className={cn(iconButtonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { IconButton, iconButtonVariants };
