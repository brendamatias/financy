import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        solid: "bg-brand-base text-white hover:bg-brand-dark",
        outline:
          "border-gray-300 bg-white text-gray-700 hover:bg-gray-200 aria-expanded:bg-gray-200",
        ghost: "text-gray-600 hover:bg-gray-100 [&_svg]:text-gray-400",
        danger: "border-danger bg-gray-100 text-gray-800 [&_svg]:text-danger",
        success: "border-success bg-gray-100 text-gray-800 [&_svg]:text-success",
      },
      size: {
        md: "h-12 gap-2 px-4 py-3 text-base [&_svg:not([class*='size-'])]:size-5",
        sm: "h-9 gap-2 px-3 py-2 text-sm [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

function Button({
  className,
  variant = "solid",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
