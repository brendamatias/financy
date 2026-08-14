import { prismaClient } from "../../prisma/prisma";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input";
import { User } from "../generated/prisma/client";
import { hashPassword, comparePasswords } from "../utils/hash";
import { signJwt } from "../utils/jwt";

export class AuthService {
  async login(data: LoginInput) {
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

  async register(data: RegisterInput) {
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

  generateTokens(user: User) {
    const token = signJwt({ id: user.id, email: user.email }, "15m");
    const refreshToken = signJwt({ id: user.id, email: user.email }, "1d");

    return { token, refreshToken, user };
  }
}
