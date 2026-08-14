import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3.5 text-base text-gray-800 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
