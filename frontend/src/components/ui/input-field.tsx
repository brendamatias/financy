import * as React from "react";
import { Eye, EyeClosed } from "lucide-react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function InputField({
  className,
  id,
  type = "text",
  label,
  helperText,
  error,
  icon,
  trailing,
  disabled,
  ...props
}: React.ComponentProps<typeof Input> & {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const description = error ?? helperText;

  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  const trailingContent =
    trailing ??
    (isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword((value) => !value)}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        disabled={disabled}
        className="flex cursor-pointer items-center text-gray-700 outline-none hover:text-brand-base disabled:pointer-events-none [&>svg]:size-4"
      >
        {showPassword ? <Eye /> : <EyeClosed />}
      </button>
    ) : null);

  return (
    <Field
      data-invalid={error ? true : undefined}
      className="group gap-1 text-gray-400 has-[input:not(:placeholder-shown)]:text-gray-700"
    >
      {label ? (
        <FieldLabel
          htmlFor={inputId}
          className="group-focus-within:text-brand-base group-data-invalid:text-danger"
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
          type={isPassword && showPassword ? "text" : type}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={description ? helperId : undefined}
          className={cn(icon && "pl-11", trailingContent && "pr-11", className)}
          {...props}
        />

        {trailingContent ? (
          <span className="absolute right-3 flex shrink-0 text-gray-400 [&>svg]:size-5">
            {trailingContent}
          </span>
        ) : null}
      </div>

      {description ? (
        <FieldDescription id={helperId} className={cn(error && "text-danger")}>
          {description}
        </FieldDescription>
      ) : null}
    </Field>
  );
}

export { InputField };
