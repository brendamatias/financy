import { HttpResponse, delay } from "msw";

import { db } from "@/mocks/data";
import { api } from "@/mocks/graphql";

const MOCK_PASSWORD = "12345678";

function buildPayload(user: User) {
  return {
    __typename: "LoginOutput",
    token: `token-${crypto.randomUUID()}`,
    refreshToken: `refresh-${crypto.randomUUID()}`,
    user: { __typename: "UserModel", ...user },
  };
}

const usedResetTokens = new Set<string>();

export const authHandlers = [
  api.mutation<
    RequestPasswordResetResponse,
    { data: RequestPasswordResetRequest }
  >("RequestPasswordReset", async () => {
    await delay(600);

    return HttpResponse.json({ data: { requestPasswordReset: true } });
  }),

  api.mutation<ResetPasswordResponse, { data: ResetPasswordRequest }>(
    "ResetPassword",
    async ({ variables }) => {
      await delay(600);

      const { token } = variables.data;

      if (!token.startsWith("reset-") || usedResetTokens.has(token)) {
        return HttpResponse.json({
          errors: [{ message: "Link de recuperação inválido ou expirado." }],
        });
      }

      usedResetTokens.add(token);

      return HttpResponse.json({ data: { resetPassword: true } });
    },
  ),

  api.mutation<RefreshTokenResponse, { data: RefreshTokenRequest }>(
    "RefreshToken",
    async ({ variables }) => {
      await delay(200);

      if (!variables.data.refreshToken.startsWith("refresh-")) {
        return HttpResponse.json({
          errors: [{ message: "Sessão expirada. Faça login novamente." }],
        });
      }

      return HttpResponse.json({
        data: { refreshToken: buildPayload(db.user) },
      });
    },
  ),

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
