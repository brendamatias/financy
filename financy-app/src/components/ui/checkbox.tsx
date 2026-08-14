import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

function Checkbox({
  className,
  id,
  label,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

  const checkbox = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      id={checkboxId}
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-gray-300 transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) {
    return checkbox;
  }

  return (
    <div className="flex items-center gap-2">
      {checkbox}
      <Label htmlFor={checkboxId}>{label}</Label>
    </div>
  );
}

export { Checkbox };
