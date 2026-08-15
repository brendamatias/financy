import { prismaClient } from "../../prisma/prisma";
import { UpdateUserInput } from "../dtos/input/user.input";
import { updateUserSchema } from "../schemas/user.schema";
import { validate } from "../utils/validate";

export class UserService {
  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    return user;
  }

  async updateUser(input: UpdateUserInput, userId: string) {
    const data = validate(updateUserSchema, input);

    await this.findUser(userId);

    return prismaClient.user.update({
      where: { id: userId },
      data,
    });
  }
}
