import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DialogCategoryForm } from "@/components/dialog-category-form";
import { Button } from "@/components/ui/button";
import { db } from "@/mocks/data";
import { renderWithRouter } from "@/tests/render";

function renderDialog(category?: Category) {
  return renderWithRouter(
    <DialogCategoryForm category={category}>
      <Button>Abrir</Button>
    </DialogCategoryForm>,
  );
}

async function openDialog(category?: Category) {
  const { user } = renderDialog(category);

  await user.click(screen.getByRole("button", { name: "Abrir" }));

  return { user };
}

describe("DialogCategoryForm", () => {
  it("requires the title", async () => {
    const { user } = await openDialog();

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(
      await screen.findByText("Informe o título da categoria"),
    ).toBeVisible();
  });

  it("creates a category and closes the dialog", async () => {
    const { user } = await openDialog();

    await user.type(screen.getByLabelText("Título"), "Educação");
    await user.type(screen.getByLabelText("Descrição"), "Cursos e livros");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(document.body).toHaveTextContent("Categoria criada com sucesso."),
    );

    expect(db.categories.at(-1)?.name).toBe("Educação");
    await waitFor(() => expect(screen.queryByLabelText("Título")).toBeNull());
  });

  it("clears the form when the dialog is closed without saving", async () => {
    const { user } = await openDialog();

    await user.type(screen.getByLabelText("Título"), "Rascunho");
    await user.click(screen.getByRole("button", { name: "Fechar" }));

    await waitFor(() => expect(screen.queryByLabelText("Título")).toBeNull());

    await user.click(screen.getByRole("button", { name: "Abrir" }));

    expect(await screen.findByLabelText("Título")).toHaveValue("");
  });

  it("prefills the form when editing", async () => {
    const category = db.categories[0];

    await openDialog(category);

    expect(await screen.findByText("Editar categoria")).toBeVisible();
    expect(screen.getByLabelText("Título")).toHaveValue(category.name);
    expect(screen.getByLabelText("Descrição")).toHaveValue(
      category.description,
    );
  });

  it("updates the category", async () => {
    const category = db.categories[0];
    const { user } = await openDialog(category);

    const title = await screen.findByLabelText("Título");

    await user.clear(title);
    await user.type(title, "Alimentação e bebidas");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(document.body).toHaveTextContent(
        "Categoria atualizada com sucesso.",
      ),
    );

    expect(db.categories[0].name).toBe("Alimentação e bebidas");
  });
});
