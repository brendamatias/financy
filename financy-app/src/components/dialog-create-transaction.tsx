import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { useCategories, useCreateTransaction } from "@/services";

const types = [
  {
    value: "expense",
    label: "Despesa",
    icon: CircleArrowDown,
    variant: "danger",
  },
  {
    value: "income",
    label: "Receita",
    icon: CircleArrowUp,
    variant: "success",
  },
] as const;

const schema = z.object({
  type: z.custom<TransactionType>(),
  description: z.string().min(1, "Informe a descrição"),
  date: z.string().min(1, "Informe a data"),
  amount: z.string().min(1, "Informe o valor"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
});

type TransactionFormData = z.infer<typeof schema>;

const defaultValues: TransactionFormData = {
  type: "expense",
  description: "",
  date: "",
  amount: "",
  categoryId: "",
};

function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 12);

  if (!digits) {
    return "";
  }

  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function DialogCreateTransaction({ children }: { children: React.ReactNode }) {
  const { data: categories } = useCategories();
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const [open, setOpen] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  }));

  function onSubmit(data: TransactionFormData) {
    createTransaction(
      {
        description: data.description,
        date: data.date,
        amount: parseCurrency(data.amount),
        type: data.type,
        categoryId: data.categoryId,
      },
      {
        onSuccess: () => {
          reset(defaultValues);
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        title="Nova transação"
        description="Registre sua despesa ou receita"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 p-2">
                {types.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={field.value === type.value ? type.variant : "ghost"}
                    onClick={() => field.onChange(type.value)}
                    aria-pressed={field.value === type.value}
                  >
                    <type.icon />
                    {type.label}
                  </Button>
                ))}
              </div>
            )}
          />

          <InputField
            label="Descrição"
            placeholder="Ex. Almoço no restaurante"
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Data"
              type="date"
              placeholder="Selecione"
              error={errors.date?.message}
              {...register("date")}
            />

            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <InputField
                  label="Valor"
                  inputMode="numeric"
                  placeholder="0,00"
                  icon={<span className="text-base text-black">R$</span>}
                  error={errors.amount?.message}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(formatCurrency(event.target.value))
                  }
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SelectField
                label="Categoria"
                items={categoryOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.categoryId?.message}
              />
            )}
          />

          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DialogCreateTransaction };
