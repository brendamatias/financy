import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DialogConfirmDelete } from "@/components/dialog-confirm-delete";
import { Button } from "@/components/ui/button";
import { renderWithRouter } from "@/tests/render";

function renderDialog({
  onConfirm = vi.fn(),
  isPending = false,
}: { onConfirm?: () => void; isPending?: boolean } = {}) {
  const { user } = renderWithRouter(
    <DialogConfirmDelete
      title="Excluir categoria"
      description="Tem certeza que deseja excluir?"
      isPending={isPending}
      onConfirm={onConfirm}
    >
      <Button>Abrir</Button>
    </DialogConfirmDelete>,
  );

  return { user, onConfirm };
}

describe("DialogConfirmDelete", () => {
  it("does not confirm before the user opens it", () => {
    const { onConfirm } = renderDialog();

    expect(screen.queryByText("Excluir categoria")).toBeNull();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("shows the title and the description when opened", async () => {
    const { user } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Abrir" }));

    expect(await screen.findByText("Excluir categoria")).toBeVisible();
    expect(screen.getByText("Tem certeza que deseja excluir?")).toBeVisible();
  });

  it("confirms when the user clicks on the delete button", async () => {
    const { user, onConfirm } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(await screen.findByRole("button", { name: /^Excluir$/ }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not confirm when the user cancels", async () => {
    const { user, onConfirm } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(await screen.findByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByText("Excluir categoria")).toBeNull(),
    );

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("shows the pending state while deleting", async () => {
    const { user } = renderDialog({ isPending: true });

    await user.click(screen.getByRole("button", { name: "Abrir" }));

    const confirm = await screen.findByRole("button", {
      name: "Excluindo...",
    });

    expect(confirm).toBeDisabled();
  });
});
