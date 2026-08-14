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
