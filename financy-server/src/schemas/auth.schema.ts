import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail")
    .pipe(z.email("Informe um e-mail válido")),
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome completo"),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail")
    .pipe(z.email("Informe um e-mail válido")),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, "Informe o refresh token"),
});
