import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { db } from "@/mocks/data";
import { SignIn } from "@/pages/auth/sign-in";
import { useAuthStore } from "@/stores/auth";
import { renderWithRouter } from "@/tests/render";

const password = "12345678";

function setup() {
  const { user } = renderWithRouter(<SignIn />, { path: "/sign-in" });

  return {
    user,
    email: screen.getByLabelText("E-mail"),
    password: screen.getByLabelText("Senha"),
    submit: screen.getByRole("button", { name: "Entrar" }),
  };
}

describe("SignIn", () => {
  it("requires the email", async () => {
    const { user, submit } = setup();

    await user.click(submit);

    expect(await screen.findByText("Informe o e-mail")).toBeVisible();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("rejects an invalid email format", async () => {
    const form = setup();

    await form.user.type(form.email, "nao-e-email");
    await form.user.type(form.password, password);
    await form.user.click(form.submit);

    expect(await screen.findByText("Informe um e-mail válido")).toBeVisible();
  });

  it("requires a password with at least 8 characters", async () => {
    const form = setup();

    await form.user.type(form.email, db.user.email);
    await form.user.type(form.password, "1234");
    await form.user.click(form.submit);

    expect(
      await screen.findByText("A senha deve ter no mínimo 8 caracteres"),
    ).toBeVisible();
  });

  it("signs in and redirects to the dashboard", async () => {
    const form = setup();

    await form.user.type(form.email, db.user.email);
    await form.user.type(form.password, password);
    await form.user.click(form.submit);

    expect(
      await screen.findByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("stays on the page when the credentials are wrong", async () => {
    const form = setup();

    await form.user.type(form.email, db.user.email);
    await form.user.type(form.password, "wrong-password");
    await form.user.click(form.submit);

    expect(
      await screen.findByText("E-mail ou senha incorretos!"),
    ).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Dashboard" })).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
