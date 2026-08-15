import { prismaClient } from "../../prisma/prisma";
import {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from "../dtos/input/auth.input";
import { User } from "../generated/prisma/client";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../schemas/auth.schema";
import { hashPassword, comparePasswords } from "../utils/hash";
import { signJwt, verifyJwt, type JwtPayload } from "../utils/jwt";
import { validate } from "../utils/validate";

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

  generateTokens(user: User) {
    const token = signJwt({ id: user.id, email: user.email }, "15m");
    const refreshToken = signJwt({ id: user.id, email: user.email }, "1d");

    return { token, refreshToken, user };
  }
}
