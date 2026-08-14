import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Lock, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { InputField } from "@/components/ui/input-field";
import { useAuthStore } from "@/stores/auth";

const schema = z.object({
  name: z.string().min(1, "Informe seu nome completo"),
  email: z
    .string()
    .min(1, "Informe o e-mail")
    .pipe(z.email("Informe um e-mail válido")),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type SignUpFormData = z.infer<typeof schema>;

function SignUp() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpFormData) {
    const success = await signUp(values);

    if (success) {
      navigate("/dashboard");
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
        <p className="mt-1 text-base text-gray-600">
          Comece a controlar suas finanças ainda hoje
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <InputField
            label="Nome completo"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            icon={<UserRound />}
            error={errors.name?.message}
            {...register("name")}
          />

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
            autoComplete="new-password"
            placeholder="Digite sua senha"
            icon={<Lock />}
            error={errors.password?.message}
            helperText="A senha deve ter no mínimo 8 caracteres"
            {...register("password")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>

      <FieldSeparator className="my-8 text-gray-500">ou</FieldSeparator>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-base text-gray-600">Já tem uma conta?</p>

        <Button variant="outline" className="w-full" asChild>
          <RouterLink to="/sign-in">
            <LogIn />
            Fazer login
          </RouterLink>
        </Button>
      </div>
    </>
  );
}

export { SignUp };
