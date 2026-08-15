import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldSeparator } from "@/components/ui/field";
import { InputField } from "@/components/ui/input-field";
import { Link } from "@/components/ui/link";
import { useAuthStore } from "@/stores/auth";

const schema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail")
    .pipe(z.email("Informe um e-mail válido")),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  remember: z.boolean(),
});

type SignInFormData = z.infer<typeof schema>;

function SignIn() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: useAuthStore.getState().rememberedEmail,
      password: "",
      remember: useAuthStore.getState().rememberMe,
    },
  });

  async function onSubmit({ email, password, remember }: SignInFormData) {
    const success = await signIn({ email, password, rememberMe: remember });

    if (success) {
      navigate("/dashboard");
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
        <p className="mt-1 text-base text-gray-600">
          Entre na sua conta para continuar
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <InputField
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="mail@exemplo.com"
            icon={<Mail />}
            error={errors.email?.message}
            {...register("email")}
          />

          <InputField
            label="Senha"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            icon={<Lock />}
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between gap-4">
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  label="Lembrar-me"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />

            <Link asChild>
              <RouterLink to="/forgot-password">Recuperar senha</RouterLink>
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <FieldSeparator className="my-8 text-gray-500">ou</FieldSeparator>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-base text-gray-600">Ainda não tem uma conta?</p>

        <Button variant="outline" className="w-full" asChild>
          <RouterLink to="/sign-up">
            <UserPlus />
            Criar conta
          </RouterLink>
        </Button>
      </div>
    </>
  );
}

export { SignIn };
