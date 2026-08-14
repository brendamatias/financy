import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SignUp } from "@/pages/auth/sign-up";
import { useAuthStore } from "@/stores/auth";
import { renderWithRouter } from "@/tests/render";

const newAccount = {
  name: "Nova Conta",
  email: "nova@teste.com",
  password: "12345678",
};

function setup() {
  const { user } = renderWithRouter(<SignUp />, { path: "/sign-up" });

  return {
    user,
    name: screen.getByLabelText("Nome completo"),
    email: screen.getByLabelText("E-mail"),
    password: screen.getByLabelText("Senha"),
    submit: screen.getByRole("button", { name: "Cadastrar" }),
  };
}

describe("SignUp", () => {
  it("requires every field", async () => {
    const { user, submit } = setup();

    await user.click(submit);

    expect(await screen.findByText("Informe seu nome completo")).toBeVisible();
    expect(screen.getByText("Informe o e-mail")).toBeVisible();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("requires a password with at least 8 characters", async () => {
    const form = setup();

    await form.user.type(form.name, newAccount.name);
    await form.user.type(form.email, newAccount.email);
    await form.user.type(form.password, "1234");
    await form.user.click(form.submit);

    expect(
      await screen.findByText("A senha deve ter no mínimo 8 caracteres"),
    ).toBeVisible();
  });

  it("creates the account, signs in and redirects to the dashboard", async () => {
    const form = setup();

    await form.user.type(form.name, newAccount.name);
    await form.user.type(form.email, newAccount.email);
    await form.user.type(form.password, newAccount.password);
    await form.user.click(form.submit);

    expect(
      await screen.findByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    const { user, isAuthenticated } = useAuthStore.getState();

    expect(isAuthenticated).toBe(true);
    expect(user?.email).toBe(newAccount.email);

    await waitFor(() =>
      expect(document.body).toHaveTextContent("Conta criada com sucesso."),
    );
  });
});
