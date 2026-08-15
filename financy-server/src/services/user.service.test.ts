import { beforeEach, describe, expect, it } from "vitest";

import { createUser } from "../tests/factories";
import { UserService } from "./user.service";

const userService = new UserService();

let userId: string;

beforeEach(async () => {
  const user = await createUser();

  userId = user.id;
});

describe("UserService.findUser", () => {
  it("returns the user of the given id", async () => {
    const user = await userService.findUser(userId);

    expect(user.email).toBe("conta@teste.com");
  });

  it("rejects an unknown id", async () => {
    await expect(userService.findUser("nao-existe")).rejects.toThrow(
      "Usuário não encontrado!",
    );
  });
});

describe("UserService.updateUser", () => {
  it("updates the name", async () => {
    const user = await userService.updateUser({ name: "Novo Nome" }, userId);

    expect(user.name).toBe("Novo Nome");
  });

  it("keeps the email untouched", async () => {
    const user = await userService.updateUser({ name: "Outro Nome" }, userId);

    expect(user.email).toBe("conta@teste.com");
  });

  it("rejects an empty name", async () => {
    await expect(
      userService.updateUser({ name: "   " }, userId),
    ).rejects.toThrow("Informe seu nome completo");
  });

  it("keeps the current data when nothing is sent", async () => {
    const user = await userService.updateUser({}, userId);

    expect(user.name).toBe("Conta Teste");
  });

  it("rejects a user that does not exist", async () => {
    await expect(
      userService.updateUser({ name: "Novo" }, "nao-existe"),
    ).rejects.toThrow("Usuário não encontrado!");
  });
});
