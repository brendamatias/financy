import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { db } from "@/mocks/data";
import { Profile } from "@/pages/app/profile";
import { useAuthStore } from "@/stores/auth";
import { renderWithRouter } from "@/tests/render";

const credentials = { email: db.user.email, password: "12345678" };

async function renderPage() {
  await useAuthStore.getState().signIn(credentials);

  return renderWithRouter(<Profile />, { path: "/profile" });
}

describe("Profile page", () => {
  it("shows the data of the signed in user", async () => {
    await renderPage();

    expect(screen.getAllByText(db.user.name).length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Nome completo")).toHaveValue(db.user.name);
  });

  it("does not let the email be edited", async () => {
    await renderPage();

    expect(screen.getByLabelText("E-mail")).toBeDisabled();
  });

  it("requires the name", async () => {
    const { user } = await renderPage();

    await user.clear(screen.getByLabelText("Nome completo"));
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(await screen.findByText("Informe seu nome completo")).toBeVisible();
  });

  it("updates the name and keeps it in the session", async () => {
    const { user } = await renderPage();

    const name = screen.getByLabelText("Nome completo");

    await user.clear(name);
    await user.type(name, "Conta Atualizada");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() =>
      expect(document.body).toHaveTextContent("Perfil atualizado com sucesso."),
    );

    expect(useAuthStore.getState().user?.name).toBe("Conta Atualizada");
  });

  it("signs the user out", async () => {
    const { user } = await renderPage();

    await user.click(screen.getByRole("button", { name: "Sair da conta" }));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
