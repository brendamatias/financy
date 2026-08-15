import * as React from "react";
import { type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function EmptyList({
  className,
  icon: Icon,
  title,
  description,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card
      data-slot="empty-list"
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 [&>svg]:size-6">
        <Icon />
      </span>

      <strong className="text-base font-semibold text-gray-800">{title}</strong>

      {description ? (
        <p className="max-w-sm text-sm text-gray-600">{description}</p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </Card>
  );
}

export { EmptyList };
