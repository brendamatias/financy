import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-4",
  {
    variants: {
      variant: {
        gray: "bg-gray-200 text-gray-700",
        blue: "bg-blue-light text-blue-dark",
        purple: "bg-purple-light text-purple-dark",
        pink: "bg-pink-light text-pink-dark",
        red: "bg-red-light text-red-dark",
        orange: "bg-orange-light text-orange-dark",
        yellow: "bg-yellow-light text-yellow-dark",
        green: "bg-green-light text-green-dark",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

function Tag({
  className,
  variant = "gray",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="tag"
      data-variant={variant}
      className={cn(tagVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Tag, tagVariants };
