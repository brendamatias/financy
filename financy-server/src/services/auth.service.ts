import { randomUUID } from "node:crypto";

import { prismaClient } from "../../prisma/prisma";
import {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from "../dtos/input/auth.input";
import { User } from "../generated/prisma/client";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";
import { hashPassword, comparePasswords } from "../utils/hash";
import { signJwt, verifyJwt, type JwtPayload } from "../utils/jwt";
import { validate } from "../utils/validate";

const RESET_TOKEN_TTL = 1000 * 60 * 60;

export class AuthService {
  async login(input: LoginInput) {
    const data = validate(loginSchema, input);

    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("E-mail ou senha incorretos!");
    }

    const isMatch = await comparePasswords(data.password, user.password);

    if (!isMatch) {
      throw new Error("E-mail ou senha incorretos!");
    }

    return this.generateTokens(user);
  }

  async register(input: RegisterInput) {
    const data = validate(registerSchema, input);

    const existingUser = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("E-mail já cadastrado!");
    }

    const hash = await hashPassword(data.password);

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    });

    return this.generateTokens(user);
  }

  async refreshToken(input: RefreshTokenInput) {
    const data = validate(refreshTokenSchema, input);

    let payload: JwtPayload;

    try {
      payload = verifyJwt(data.refreshToken);
    } catch {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    const user = await prismaClient.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    return this.generateTokens(user);
  }

  async requestPasswordReset(input: RequestPasswordResetInput) {
    const data = validate(requestPasswordResetSchema, input);

    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return true;
    }

    const token = randomUUID();

    await prismaClient.passwordReset.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL),
      },
    });

    const appUrl = process.env.APP_URL ?? "http://localhost:5173";

    console.log(
      [
        "",
        "======================= RECUPERAR SENHA =======================",
        `e-mail: ${user.email}`,
        `link:   ${appUrl}/reset-password?token=${token}`,
        "===============================================================",
        "",
      ].join("\n"),
    );

    return true;
  }

  async resetPassword(input: ResetPasswordInput) {
    const data = validate(resetPasswordSchema, input);

    const reset = await prismaClient.passwordReset.findUnique({
      where: { token: data.token },
      include: { user: true },
    });

    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      throw new Error("Link de recuperação inválido ou expirado.");
    }

    const hash = await hashPassword(data.password);

    await prismaClient.$transaction([
      prismaClient.user.update({
        where: { id: reset.userId },
        data: { password: hash },
      }),
      prismaClient.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
      prismaClient.passwordReset.deleteMany({
        where: { userId: reset.userId, usedAt: null },
      }),
    ]);

    return true;
  }

  generateTokens(user: User) {
    const token = signJwt({ id: user.id, email: user.email }, "15m");
    const refreshToken = signJwt({ id: user.id, email: user.email }, "1d");

    return { token, refreshToken, user };
  }
}
