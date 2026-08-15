import { describe, expect, it } from "vitest";

import { prismaClient } from "../../prisma/prisma";
import { comparePasswords } from "../utils/hash";
import { verifyJwt } from "../utils/jwt";
import { AuthService } from "./auth.service";

const authService = new AuthService();

const validUser = {
  name: "Conta Teste",
  email: "conta@teste.com",
  password: "12345678",
};

describe("AuthService.register", () => {
  it("creates the user and returns the tokens", async () => {
    const result = await authService.register(validUser);

    expect(result.user.email).toBe(validUser.email);
    expect(result.user.name).toBe(validUser.name);
    expect(result.token).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it("stores the password hashed, never in plain text", async () => {
    const { user } = await authService.register(validUser);

    expect(user.password).not.toBe(validUser.password);
    await expect(
      comparePasswords(validUser.password, user.password),
    ).resolves.toBe(true);
  });

  it("signs the token with the user id and email", async () => {
    const { token, user } = await authService.register(validUser);

    const payload = verifyJwt(token);

    expect(payload.id).toBe(user.id);
    expect(payload.email).toBe(user.email);
  });

  it("rejects an email that is already registered", async () => {
    await authService.register(validUser);

    await expect(authService.register(validUser)).rejects.toThrow(
      "E-mail já cadastrado!",
    );

    const total = await prismaClient.user.count();
    expect(total).toBe(1);
  });
});

describe("AuthService validation", () => {
  it("rejects an invalid email on register", async () => {
    await expect(
      authService.register({ ...validUser, email: "not-an-email" }),
    ).rejects.toThrow("Informe um e-mail válido");
  });

  it("rejects a password shorter than 8 characters on register", async () => {
    await expect(
      authService.register({ ...validUser, password: "1234" }),
    ).rejects.toThrow("A senha deve ter no mínimo 8 caracteres");
  });

  it("rejects an empty name on register", async () => {
    await expect(
      authService.register({ ...validUser, name: "   " }),
    ).rejects.toThrow("Informe seu nome completo");
  });

  it("does not create the user when validation fails", async () => {
    await expect(
      authService.register({ ...validUser, email: "not-an-email" }),
    ).rejects.toThrow();

    expect(await prismaClient.user.count()).toBe(0);
  });

  it("rejects an invalid email on login", async () => {
    await expect(
      authService.login({ email: "not-an-email", password: "12345678" }),
    ).rejects.toThrow("Informe um e-mail válido");
  });

  it("trims the email before looking the user up", async () => {
    await authService.register(validUser);

    const result = await authService.login({
      email: `  ${validUser.email}  `,
      password: validUser.password,
    });

    expect(result.user.email).toBe(validUser.email);
  });
});

describe("AuthService.login", () => {
  it("authenticates with the correct credentials", async () => {
    const created = await authService.register(validUser);

    const result = await authService.login({
      email: validUser.email,
      password: validUser.password,
    });

    expect(result.user.id).toBe(created.user.id);
    expect(result.token).toBeTruthy();
  });

  it("rejects a wrong password", async () => {
    await authService.register(validUser);

    await expect(
      authService.login({ email: validUser.email, password: "wrong-password" }),
    ).rejects.toThrow("E-mail ou senha incorretos!");
  });

  it("rejects an email that does not exist", async () => {
    await expect(
      authService.login({
        email: "unknown@teste.com",
        password: validUser.password,
      }),
    ).rejects.toThrow("E-mail ou senha incorretos!");
  });
});

describe("AuthService.refreshToken", () => {
  it("returns a new pair of tokens", async () => {
    const { refreshToken, user } = await authService.register(validUser);

    const result = await authService.refreshToken({ refreshToken });

    expect(result.token).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.user.id).toBe(user.id);
  });

  it("signs the new token for the same user", async () => {
    const { refreshToken, user } = await authService.register(validUser);

    const result = await authService.refreshToken({ refreshToken });
    const payload = verifyJwt(result.token);

    expect(payload.id).toBe(user.id);
    expect(payload.email).toBe(user.email);
  });

  it("rejects a malformed refresh token", async () => {
    await expect(
      authService.refreshToken({ refreshToken: "nao-e-um-token" }),
    ).rejects.toThrow("Sessão expirada. Faça login novamente.");
  });

  it("rejects an empty refresh token", async () => {
    await expect(
      authService.refreshToken({ refreshToken: "  " }),
    ).rejects.toThrow("Informe o refresh token");
  });

  it("rejects a token signed for a user that no longer exists", async () => {
    const { refreshToken, user } = await authService.register(validUser);

    await prismaClient.user.delete({ where: { id: user.id } });

    await expect(authService.refreshToken({ refreshToken })).rejects.toThrow(
      "Sessão expirada. Faça login novamente.",
    );
  });
});

describe("AuthService.requestPasswordReset", () => {
  it("creates a reset token for a known email", async () => {
    await authService.register(validUser);

    await expect(
      authService.requestPasswordReset({ email: validUser.email }),
    ).resolves.toBe(true);

    const reset = await prismaClient.passwordReset.findFirst();

    expect(reset?.token).toBeTruthy();
    expect(reset?.usedAt).toBeNull();
    expect(reset!.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("answers the same way for an unknown email, without creating a token", async () => {
    await expect(
      authService.requestPasswordReset({ email: "naoexiste@teste.com" }),
    ).resolves.toBe(true);

    expect(await prismaClient.passwordReset.count()).toBe(0);
  });

  it("rejects an invalid email", async () => {
    await expect(
      authService.requestPasswordReset({ email: "not-an-email" }),
    ).rejects.toThrow("Informe um e-mail válido");
  });
});

describe("AuthService.resetPassword", () => {
  async function createResetToken() {
    await authService.register(validUser);
    await authService.requestPasswordReset({ email: validUser.email });

    const reset = await prismaClient.passwordReset.findFirstOrThrow();

    return reset.token;
  }

  it("changes the password and lets the user sign in with it", async () => {
    const token = await createResetToken();

    await expect(
      authService.resetPassword({ token, password: "nova-senha-123" }),
    ).resolves.toBe(true);

    const result = await authService.login({
      email: validUser.email,
      password: "nova-senha-123",
    });

    expect(result.user.email).toBe(validUser.email);
  });

  it("invalidates the old password", async () => {
    const token = await createResetToken();

    await authService.resetPassword({ token, password: "nova-senha-123" });

    await expect(
      authService.login({
        email: validUser.email,
        password: validUser.password,
      }),
    ).rejects.toThrow("E-mail ou senha incorretos!");
  });

  it("does not accept the same token twice", async () => {
    const token = await createResetToken();

    await authService.resetPassword({ token, password: "nova-senha-123" });

    await expect(
      authService.resetPassword({ token, password: "outra-senha-123" }),
    ).rejects.toThrow("Link de recuperação inválido ou expirado.");
  });

  it("rejects an unknown token", async () => {
    await expect(
      authService.resetPassword({ token: "nao-existe", password: "12345678" }),
    ).rejects.toThrow("Link de recuperação inválido ou expirado.");
  });

  it("rejects an expired token", async () => {
    const token = await createResetToken();

    await prismaClient.passwordReset.update({
      where: { token },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    await expect(
      authService.resetPassword({ token, password: "nova-senha-123" }),
    ).rejects.toThrow("Link de recuperação inválido ou expirado.");
  });

  it("rejects a short password", async () => {
    const token = await createResetToken();

    await expect(
      authService.resetPassword({ token, password: "1234" }),
    ).rejects.toThrow("A senha deve ter no mínimo 8 caracteres");
  });
});
