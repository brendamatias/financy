import * as React from "react";

import { cn } from "@/lib/utils";

function TitleSection({
  className,
  text,
  ...props
}: React.ComponentProps<"span"> & { text: string }) {
  return (
    <span
      data-slot="title-section"
      className={cn(
        "text-xs font-medium tracking-wider text-gray-500 uppercase",
        className,
      )}
      {...props}
    >
      {text}
    </span>
  );
}

export { TitleSection };
