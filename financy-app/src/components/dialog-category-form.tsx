import { useLazyQuery, useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { InputField } from "@/components/ui/input-field";
import { categoryIcons } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import {
  CREATE_CATEGORY,
  GET_CATEGORY,
  REFETCH_CATEGORIES,
  UPDATE_CATEGORY,
} from "@/services";

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

const schema = z.object({
  name: z.string().min(1, "Informe o título da categoria"),
  description: z.string(),
  icon: z.custom<CategoryIconName>(),
  color: z.custom<CategoryColor>(),
});

type CategoryFormData = z.infer<typeof schema>;

const defaultValues: CategoryFormData = {
  name: "",
  description: "",
  icon: "briefcase",
  color: "green",
};
function DialogCategoryForm({
  children,
  categoryId,
}: {
  children: React.ReactNode;
  categoryId?: string;
}) {
  const isEditing = Boolean(categoryId);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [loadCategory, { loading: isLoadingCategory }] =
    useLazyQuery(GET_CATEGORY);

  const mutationOptions = {
    refetchQueries: REFETCH_CATEGORIES,
    onCompleted: () => {
      toast.success(
        isEditing
          ? "Categoria atualizada com sucesso."
          : "Categoria criada com sucesso.",
      );
      setOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  };

  const [createCategory, { loading: isCreating }] = useMutation(
    CREATE_CATEGORY,
    mutationOptions,
  );

  const [updateCategory, { loading: isUpdating }] = useMutation(
    UPDATE_CATEGORY,
    mutationOptions,
  );

  const isPending = isCreating || isUpdating;

  function onSubmit(data: CategoryFormData) {
    if (categoryId) {
      updateCategory({ variables: { id: categoryId, data } });
      return;
    }

    createCategory({ variables: { data } });
  }

  async function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      reset(defaultValues);
      return;
    }

    if (!categoryId) {
      return;
    }

    const { data, error } = await loadCategory({
      variables: { id: categoryId },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      reset({
        name: data.getCategory.name,
        description: data.getCategory.description,
        icon: data.getCategory.icon,
        color: data.getCategory.color,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        title={isEditing ? "Editar categoria" : "Nova categoria"}
        description="Organize suas transações com categorias"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <InputField
            label="Título"
            placeholder="Ex. Alimentação"
            error={errors.name?.message}
            {...register("name")}
          />

          <InputField
            label="Descrição"
            placeholder="Descrição da categoria"
            helperText="Opcional"
            {...register("description")}
          />

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FieldLabel>Ícone</FieldLabel>

                <div className="grid grid-cols-8 justify-items-center gap-2">
                  {icons.map(([name, Icon]) => (
                    <IconButton
                      key={name}
                      type="button"
                      size="md"
                      onClick={() => field.onChange(name)}
                      aria-label={name}
                      aria-pressed={field.value === name}
                      className={cn(
                        "text-gray-500",
                        field.value === name &&
                          "border-brand-base text-gray-600",
                      )}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </div>
              </div>
            )}
          />

          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FieldLabel>Cor</FieldLabel>

                <div className="grid grid-cols-7 justify-items-center gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => field.onChange(color.name)}
                      aria-label={color.name}
                      aria-pressed={field.value === color.name}
                      className={cn(
                        "flex h-7.5 w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 p-1 transition-colors",
                        field.value === color.name && "border-brand-base",
                      )}
                    >
                      <span
                        className={cn("size-full rounded-md", color.className)}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isPending || isLoadingCategory}
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DialogCategoryForm };
