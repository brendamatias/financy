import * as React from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  Bubbles,
  CarFront,
  CreditCard,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  PiggyBank,
  ReceiptText,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Ticket,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { type CategoryColor } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { InputField } from "@/components/ui/input-field";
import { cn } from "@/lib/utils";

const icons: { name: string; icon: LucideIcon }[] = [
  { name: "Trabalho", icon: BriefcaseBusiness },
  { name: "Transporte", icon: CarFront },
  { name: "Saúde", icon: HeartPulse },
  { name: "Investimento", icon: PiggyBank },
  { name: "Mercado", icon: ShoppingCart },
  { name: "Entretenimento", icon: Ticket },
  { name: "Compras", icon: ShoppingBasket },
  { name: "Alimentação", icon: Utensils },
  { name: "Limpeza", icon: Bubbles },
  { name: "Casa", icon: House },
  { name: "Presentes", icon: Gift },
  { name: "Academia", icon: Dumbbell },
  { name: "Educação", icon: BookOpen },
  { name: "Viagem", icon: ShoppingBag },
  { name: "Cartão", icon: CreditCard },
  { name: "Contas", icon: ReceiptText },
];

const colors: { name: CategoryColor; className: string }[] = [
  { name: "green", className: "bg-green-base" },
  { name: "blue", className: "bg-blue-base" },
  { name: "purple", className: "bg-purple-base" },
  { name: "pink", className: "bg-pink-base" },
  { name: "red", className: "bg-red-base" },
  { name: "orange", className: "bg-orange-base" },
  { name: "yellow", className: "bg-yellow-base" },
];

function DialogCreateCategory({ children }: { children: React.ReactNode }) {
  const [selectedIcon, setSelectedIcon] = React.useState(icons[0].name);
  const [selectedColor, setSelectedColor] = React.useState<CategoryColor>(
    colors[0].name,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        title="Nova categoria"
        description="Organize suas transações com categorias"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Título"
            name="title"
            placeholder="Ex. Alimentação"
          />

          <InputField
            label="Descrição"
            name="description"
            placeholder="Descrição da categoria"
            helperText="Opcional"
          />

          <div className="flex flex-col gap-2">
            <FieldLabel>Ícone</FieldLabel>

            <div className="grid grid-cols-8 justify-items-center gap-2">
              {icons.map((item) => (
                <IconButton
                  key={item.name}
                  type="button"
                  size="md"
                  onClick={() => setSelectedIcon(item.name)}
                  aria-label={item.name}
                  aria-pressed={selectedIcon === item.name}
                  className={cn(
                    "text-gray-500",
                    selectedIcon === item.name &&
                      "border-brand-base text-gray-600",
                  )}
                >
                  <item.icon />
                </IconButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Cor</FieldLabel>

            <div className="grid grid-cols-7 justify-items-center gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                  aria-pressed={selectedColor === color.name}
                  className={cn(
                    "flex h-7.5 w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 p-1 transition-colors",
                    selectedColor === color.name && "border-brand-base",
                  )}
                >
                  <span
                    className={cn("size-full rounded-md", color.className)}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-2">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DialogCreateCategory };
