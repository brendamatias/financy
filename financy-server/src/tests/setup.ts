import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

import { config } from "dotenv";
import { afterAll, beforeAll, beforeEach } from "vitest";

config({ path: ".env.test", override: true });

const databaseFile = resolve(process.cwd(), "test.db");

function removeDatabase() {
  rmSync(databaseFile, { force: true });
  rmSync(`${databaseFile}-journal`, { force: true });
}

beforeAll(() => {
  removeDatabase();

  execSync("npx prisma migrate deploy", {
    stdio: "ignore",
    env: process.env,
  });
});

beforeEach(async () => {
  const { prismaClient } = await import("../../prisma/prisma");

  await prismaClient.passwordReset.deleteMany();
  await prismaClient.transaction.deleteMany();
  await prismaClient.category.deleteMany();
  await prismaClient.user.deleteMany();
});

afterAll(async () => {
  const { prismaClient } = await import("../../prisma/prisma");

  await prismaClient.$disconnect();
  removeDatabase();
});
