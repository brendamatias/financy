import { LogIn, Lock, Mail, UserRound } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { InputField } from "@/components/ui/input-field";

function SignUp() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
        <p className="mt-1 text-base text-gray-600">
          Comece a controlar suas finanças ainda hoje
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <InputField
            label="Nome completo"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Seu nome completo"
            icon={<UserRound />}
          />

          <InputField
            label="E-mail"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="mail@exemplo.com"
            icon={<Mail />}
          />

          <InputField
            label="Senha"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Digite sua senha"
            helperText="A senha deve ter no mínimo 8 caracteres"
            icon={<Lock />}
          />
        </div>

        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
      </form>

      <FieldSeparator className="my-8 text-gray-500">ou</FieldSeparator>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-base text-gray-600">Já tem uma conta?</p>

        <Button variant="outline" className="w-full" asChild>
          <RouterLink to="/">
            <LogIn />
            Fazer login
          </RouterLink>
        </Button>
      </div>
    </>
  );
}

export { SignUp };
