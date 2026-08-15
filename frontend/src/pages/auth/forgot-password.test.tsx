import { screen, waitFor } from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { api } from "@/mocks/graphql";
import { db } from "@/mocks/data";
import { ForgotPassword } from "@/pages/auth/forgot-password";
import { renderWithRouter } from "@/tests/render";
import { server } from "@/tests/setup";

function setup() {
  const { user } = renderWithRouter(<ForgotPassword />, {
    path: "/forgot-password",
  });

  return {
    user,
    email: screen.getByLabelText("E-mail"),
    submit: screen.getByRole("button", { name: "Enviar link" }),
  };
}

describe("ForgotPassword", () => {
  it("requires the email", async () => {
    const { user, submit } = setup();

    await user.click(submit);

    expect(await screen.findByText("Informe o e-mail")).toBeVisible();
  });

  it("rejects an invalid email format", async () => {
    const form = setup();

    await form.user.type(form.email, "nao-e-email");
    await form.user.click(form.submit);

    expect(await screen.findByText("Informe um e-mail válido")).toBeVisible();
  });

  it("shows the confirmation message after sending the link", async () => {
    const form = setup();

    await form.user.type(form.email, db.user.email);
    await form.user.click(form.submit);

    expect(
      await screen.findByRole("heading", { name: "Verifique seu e-mail" }),
    ).toBeVisible();
    expect(screen.queryByLabelText("E-mail")).toBeNull();
  });

  it("keeps the form on screen when the request fails", async () => {
    server.use(
      api.mutation("RequestPasswordReset", () =>
        HttpResponse.json({
          errors: [{ message: "Ocorreu um erro. Tente novamente." }],
        }),
      ),
    );

    const form = setup();

    await form.user.type(form.email, db.user.email);
    await form.user.click(form.submit);

    await waitFor(() =>
      expect(document.body).toHaveTextContent("Ocorreu um erro"),
    );

    expect(screen.getByLabelText("E-mail")).toBeVisible();
  });
});
