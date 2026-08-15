import { screen, waitFor } from "@testing-library/react";
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

  it("does not remember the session by default", async () => {
    const form = setup();

    await form.user.type(form.email, db.user.email);
    await form.user.type(form.password, password);
    await form.user.click(form.submit);

    await screen.findByRole("heading", { name: "Dashboard" });

    expect(useAuthStore.getState().rememberMe).toBe(false);
    expect(localStorage.getItem("financy:auth")).toBeNull();
  });

  it("remembers the session when the checkbox is checked", async () => {
    const form = setup();

    await form.user.type(form.email, db.user.email);
    await form.user.type(form.password, password);
    await form.user.click(screen.getByLabelText("Lembrar-me"));
    await form.user.click(form.submit);

    await screen.findByRole("heading", { name: "Dashboard" });

    expect(useAuthStore.getState().rememberMe).toBe(true);
    expect(localStorage.getItem("financy:auth")).toBeTruthy();
  });

  it("starts with the checkbox marked when the user asked to be remembered", async () => {
    localStorage.setItem("financy:remember-me", "true");
    useAuthStore.setState({ rememberMe: true });

    setup();

    expect(screen.getByLabelText("Lembrar-me")).toBeChecked();
  });

  it("starts with the remembered email filled in", async () => {
    localStorage.setItem("financy:remember-me", "true");
    localStorage.setItem("financy:remembered-email", db.user.email);
    useAuthStore.setState({
      rememberMe: true,
      rememberedEmail: db.user.email,
    });

    setup();

    expect(screen.getByLabelText("E-mail")).toHaveValue(db.user.email);
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

    await waitFor(() =>
      expect(document.body).toHaveTextContent("E-mail ou senha incorretos!"),
    );

    expect(screen.queryByRole("heading", { name: "Dashboard" })).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
