import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { todayISO } from "@/lib/format";
import toast from "react-hot-toast";

import {
  CREATE_TRANSACTION,
  GET_TRANSACTION,
  LIST_CATEGORIES,
  REFETCH_TRANSACTIONS,
  UPDATE_TRANSACTION,
} from "@/lib/graphql";

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
  date: z
    .string()
    .min(1, "Informe a data")
    .refine((date) => date <= todayISO(), "A data não pode ser no futuro"),
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

function toCurrencyInput(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function DialogTransactionForm({
  children,
  transactionId,
}: {
  children: React.ReactNode;
  transactionId?: string;
}) {
  const isEditing = Boolean(transactionId);
  const { data: categoriesData } = useQuery(LIST_CATEGORIES);
  const categories = categoriesData?.listCategories;
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

  const [loadTransaction, { loading: isLoadingTransaction }] =
    useLazyQuery(GET_TRANSACTION);

  const mutationOptions = {
    refetchQueries: REFETCH_TRANSACTIONS,
    onCompleted: () => {
      toast.success(
        isEditing
          ? "Transação atualizada com sucesso."
          : "Transação criada com sucesso.",
      );
      setOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  };

  const [createTransaction, { loading: isCreating }] = useMutation(
    CREATE_TRANSACTION,
    mutationOptions,
  );

  const [updateTransaction, { loading: isUpdating }] = useMutation(
    UPDATE_TRANSACTION,
    mutationOptions,
  );

  const isPending = isCreating || isUpdating;

  React.useEffect(() => {
    if (!open) {
      return;
    }

    reset(defaultValues);

    if (!transactionId) {
      return;
    }

    loadTransaction({ variables: { id: transactionId } }).then(
      ({ data, error }) => {
        if (error) {
          toast.error(error.message);
          return;
        }

        if (data) {
          const transaction = data.getTransaction;

          reset({
            type: transaction.type,
            description: transaction.description,
            date: transaction.date.split("T")[0],
            amount: toCurrencyInput(transaction.amount),
            categoryId: transaction.categoryId,
          });
        }
      },
    );
  }, [open, transactionId, loadTransaction, reset]);

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  }));

  function onSubmit(data: TransactionFormData) {
    const variables = {
      description: data.description,
      date: data.date,
      amount: parseCurrency(data.amount),
      type: data.type,
      categoryId: data.categoryId,
    };

    if (transactionId) {
      updateTransaction({ variables: { id: transactionId, data: variables } });
      return;
    }

    createTransaction({ variables: { data: variables } });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        title={isEditing ? "Editar transação" : "Nova transação"}
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
                    variant={
                      field.value === type.value ? type.variant : "ghost"
                    }
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
              max={todayISO()}
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

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isPending || isLoadingTransaction}
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DialogTransactionForm };
