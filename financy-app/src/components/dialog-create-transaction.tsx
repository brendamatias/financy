import * as React from "react";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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

function DialogCreateTransaction({ children }: { children: React.ReactNode }) {
  const [selectedType, setSelectedType] =
    React.useState<(typeof types)[number]["value"]>("expense");
  const [amount, setAmount] = React.useState("");

  const { data: categories } = useCategories();
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  }));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    createTransaction(
      {
        description: String(data.get("description") ?? ""),
        date: String(data.get("date") ?? ""),
        amount: Number(amount.replace(/\./g, "").replace(",", ".")),
        type: selectedType,
        categoryId: String(data.get("category") ?? ""),
      },
      {
        onSuccess: () => {
          form.reset();
          setAmount("");
          setSelectedType("expense");
          closeRef.current?.click();
        },
      },
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        title="Nova transação"
        description="Registre sua despesa ou receita"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 p-2">
            {types.map((type) => (
              <Button
                key={type.value}
                type="button"
                variant={selectedType === type.value ? type.variant : "ghost"}
                onClick={() => setSelectedType(type.value)}
                aria-pressed={selectedType === type.value}
              >
                <type.icon />
                {type.label}
              </Button>
            ))}
          </div>

          <InputField
            label="Descrição"
            name="description"
            placeholder="Ex. Almoço no restaurante"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Data"
              name="date"
              type="date"
              placeholder="Selecione"
            />

            <InputField
              label="Valor"
              name="amount"
              inputMode="numeric"
              placeholder="0,00"
              value={amount}
              onChange={(event) =>
                setAmount(formatCurrency(event.target.value))
              }
              icon={<span className="text-base text-black">R$</span>}
            />
          </div>

          <SelectField label="Categoria" name="category" items={categoryOptions} />

          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>

          <DialogClose ref={closeRef} className="hidden" />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DialogCreateTransaction };
