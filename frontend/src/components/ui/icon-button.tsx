import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  cn(
    buttonVariants({ variant: null, size: null }),
    "border-gray-300 bg-white [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        default: "text-gray-700 hover:bg-gray-200",
        danger: "text-danger hover:bg-gray-200",
      },
      size: {
        sm: "size-8",
        md: "size-[42px] [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

function IconButton({
  className,
  variant = "default",
  size = "sm",
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
      data-size={size}
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { IconButton, iconButtonVariants };
