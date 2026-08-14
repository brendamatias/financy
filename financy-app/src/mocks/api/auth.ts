import { HttpResponse, delay, graphql } from "msw";

import { db } from "@/mocks/data";

const api = graphql.link(import.meta.env.VITE_GRAPHQL_URL);

const MOCK_PASSWORD = "12345678";

function buildPayload(user: User) {
  return {
    token: crypto.randomUUID(),
    refreshToken: crypto.randomUUID(),
    user,
  };
}

export const authHandlers = [
  api.mutation<LoginResponse, { data: LoginRequest }>(
    "Login",
    async ({ variables }) => {
      await delay(600);

      const { email, password } = variables.data;

      if (email !== db.user.email || password !== MOCK_PASSWORD) {
        return HttpResponse.json({
          errors: [{ message: "E-mail ou senha incorretos!" }],
        });
      }

      return HttpResponse.json({
        data: { login: buildPayload(db.user) },
      });
    },
  ),

  api.mutation<RegisterResponse, { data: RegisterRequest }>(
    "Register",
    async ({ variables }) => {
      await delay(600);

      const { name, email } = variables.data;

      db.user = {
        ...db.user,
        id: crypto.randomUUID(),
        name,
        email,
        updatedAt: new Date().toISOString(),
      };

      return HttpResponse.json({
        data: { register: buildPayload(db.user) },
      });
    },
  ),
];
