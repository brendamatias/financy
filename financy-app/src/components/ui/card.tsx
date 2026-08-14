import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
