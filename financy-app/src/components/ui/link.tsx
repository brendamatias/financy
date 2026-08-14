import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

function Link({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="link"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-sm text-sm font-medium whitespace-nowrap text-brand-base underline-offset-4 transition-all outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export { Link };
