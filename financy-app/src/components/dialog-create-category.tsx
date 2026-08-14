import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { InputField } from "@/components/ui/input-field";
import { categoryIcons } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { useCreateCategory } from "@/services";

const icons = Object.entries(categoryIcons) as [
  CategoryIconName,
  (typeof categoryIcons)[CategoryIconName],
][];

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
  const [selectedIcon, setSelectedIcon] =
    React.useState<CategoryIconName>("briefcase");
  const [selectedColor, setSelectedColor] = React.useState<CategoryColor>(
    colors[0].name,
  );

  const { mutate: createCategory, isPending } = useCreateCategory();
  const closeRef = React.useRef<HTMLButtonElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    createCategory(
      {
        name: String(data.get("name") ?? ""),
        description: String(data.get("description") ?? ""),
        color: selectedColor,
        icon: selectedIcon,
      },
      {
        onSuccess: () => {
          form.reset();
          closeRef.current?.click();
        },
      },
    );
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
            name="name"
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
              {icons.map(([name, Icon]) => (
                <IconButton
                  key={name}
                  type="button"
                  size="md"
                  onClick={() => setSelectedIcon(name)}
                  aria-label={name}
                  aria-pressed={selectedIcon === name}
                  className={cn(
                    "text-gray-500",
                    selectedIcon === name && "border-brand-base text-gray-600",
                  )}
                >
                  <Icon />
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

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>

          <DialogClose ref={closeRef} className="hidden" />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DialogCreateCategory };
