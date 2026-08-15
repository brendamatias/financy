import { type LucideIcon } from "lucide-react";

import { TitleSection } from "@/components/title-section";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SummaryCard({
  label,
  value,
  title,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: React.ReactNode;
  title?: string;
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <Card className="flex gap-4">
      <div className="flex h-8 w-8 items-center justify-center">
        <Icon className={cn("size-6", iconClassName)} />
      </div>

      <div className="flex flex-col gap-2">
        <strong
          title={title}
          className="text-[28px] leading-8 font-bold text-gray-800"
        >
          {value}
        </strong>

        <TitleSection text={label} />
      </div>
    </Card>
  );
}

function SummaryCardSkeleton() {
  return (
    <Card className="flex gap-4">
      <Skeleton className="size-8 rounded-lg" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
    </Card>
  );
}

export { SummaryCard, SummaryCardSkeleton };
