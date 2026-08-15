import * as React from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectFieldItem = string | { value: string; label: React.ReactNode };

function SelectField({
  className,
  id,
  label,
  helperText,
  error,
  placeholder = "Selecione",
  items,
  disabled,
  ...props
}: React.ComponentProps<typeof Select> & {
  className?: string;
  id?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string;
  placeholder?: string;
  items: SelectFieldItem[];
}) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const helperId = `${selectId}-helper`;
  const description = error ?? helperText;

  const options = items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );

  return (
    <Field
      data-invalid={error ? true : undefined}
      className="group gap-1 text-gray-400"
    >
      {label ? (
        <FieldLabel
          htmlFor={selectId}
          className="group-focus-within:text-brand-base group-data-invalid:text-danger"
        >
          {label}
        </FieldLabel>
      ) : null}

      <Select disabled={disabled} {...props}>
        <SelectTrigger
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={description ? helperId : undefined}
          className={cn(className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description ? (
        <FieldDescription id={helperId} className={cn(error && "text-danger")}>
          {description}
        </FieldDescription>
      ) : null}
    </Field>
  );
}

export { SelectField, type SelectFieldItem };
