import * as React from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function InputField({
  className,
  id,
  label,
  helperText,
  error = false,
  icon,
  disabled,
  ...props
}: React.ComponentProps<typeof Input> & {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  icon?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;

  return (
    <Field
      data-invalid={error || undefined}
      className="group gap-1 text-gray-400 has-[input:not(:placeholder-shown)]:text-gray-700"
    >
      {label ? (
        <FieldLabel
          htmlFor={inputId}
          className="text-gray-700 group-focus-within:text-brand-base group-data-invalid:text-danger"
        >
          {label}
        </FieldLabel>
      ) : null}

      <div className="relative flex items-center">
        {icon ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 flex shrink-0 group-focus-within:text-brand-base group-data-invalid:text-danger group-has-[input:disabled]:text-gray-400 [&>svg]:size-5"
          >
            {icon}
          </span>
        ) : null}

        <Input
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
          className={cn(icon && "pl-11", className)}
          {...props}
        />
      </div>

      {helperText ? (
        <FieldDescription
          id={helperId}
          className="text-xs text-gray-500"
        >
          {helperText}
        </FieldDescription>
      ) : null}
    </Field>
  );
}

export { InputField };
