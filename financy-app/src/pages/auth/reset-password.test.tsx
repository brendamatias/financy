import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResetPassword } from "@/pages/auth/reset-password";
import { renderWithRouter } from "@/tests/render";

function setup(token = `reset-${crypto.randomUUID()}`) {
  const { user } = renderWithRouter(<ResetPassword />, {
    path: `/reset-password${token ? `?token=${token}` : ""}`,
  });

  return { user, token };
}

function getFields() {
  return {
    password: screen.getByLabelText("Nova senha"),
    passwordConfirmation: screen.getByLabelText("Confirmar nova senha"),
    submit: screen.getByRole("button", { name: "Salvar nova senha" }),
  };
}

describe("ResetPassword", () => {
  it("asks for a new link when the token is missing", () => {
    setup("");

    expect(
      screen.getByRole("heading", { name: "Link de recuperação inválido" }),
    ).toBeVisible();
    expect(screen.queryByLabelText("Nova senha")).toBeNull();
  });

  it("requires a password with at least 8 characters", async () => {
    const { user } = setup();
    const fields = getFields();

    await user.type(fields.password, "1234");
    await user.type(fields.passwordConfirmation, "1234");
    await user.click(fields.submit);

    expect(
      await screen.findByText("A senha deve ter no mínimo 8 caracteres"),
    ).toBeVisible();
  });

  it("requires both passwords to match", async () => {
    const { user } = setup();
    const fields = getFields();

    await user.type(fields.password, "12345678");
    await user.type(fields.passwordConfirmation, "87654321");
    await user.click(fields.submit);

    expect(await screen.findByText("As senhas não conferem")).toBeVisible();
  });

  it("redirects to the sign in page after changing the password", async () => {
    const { user } = setup();
    const fields = getFields();

    await user.type(fields.password, "nova-senha-123");
    await user.type(fields.passwordConfirmation, "nova-senha-123");
    await user.click(fields.submit);

    expect(
      await screen.findByRole("heading", { name: "Fazer login" }),
    ).toBeVisible();
  });

  it("stays on the page when the token is invalid", async () => {
    const { user } = setup("token-expirado");
    const fields = getFields();

    await user.type(fields.password, "nova-senha-123");
    await user.type(fields.passwordConfirmation, "nova-senha-123");
    await user.click(fields.submit);

    await waitFor(() =>
      expect(document.body).toHaveTextContent(
        "Link de recuperação inválido ou expirado.",
      ),
    );

    expect(screen.getByLabelText("Nova senha")).toBeVisible();
  });
});
