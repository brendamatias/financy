import * as React from "react";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const colors = {
  green: "bg-green-light text-green-base",
  blue: "bg-blue-light text-blue-base",
  purple: "bg-purple-light text-purple-base",
  pink: "bg-pink-light text-pink-base",
  red: "bg-red-light text-red-base",
  orange: "bg-orange-light text-orange-base",
  yellow: "bg-yellow-light text-yellow-base",
} as const;

type CategoryColor = keyof typeof colors;

function CategoryIcon({
  className,
  icon: Icon,
  color = "green",
  ...props
}: React.ComponentProps<"span"> & {
  icon: LucideIcon;
  color?: CategoryColor;
}) {
  return (
    <span
      data-slot="category-icon"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg [&>svg]:size-4",
        colors[color],
        className,
      )}
      {...props}
    >
      <Icon />
    </span>
  );
}

export { CategoryIcon, type CategoryColor };
