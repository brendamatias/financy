import { Lock, Mail, UserPlus } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldSeparator } from "@/components/ui/field";
import { InputField } from "@/components/ui/input-field";
import { Link } from "@/components/ui/link";

import logo from "@/assets/logo.svg";

function SignIn() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="flex min-h-svh flex-col items-center gap-8 px-4 py-16">
      <img src={logo} alt="Financy" />

      <div className="bg-white border-gray-200 border rounded-xl w-md p-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
          <p className="mt-1 text-base text-gray-600">
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
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
              autoComplete="current-password"
              placeholder="Digite sua senha"
              icon={<Lock />}
            />

            <div className="flex items-center justify-between gap-4">
              <Checkbox id="remember" name="remember" label="Lembrar-me" />
              <Link href="/recuperar-senha">Recuperar senha</Link>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Entrar
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
      </div>
    </div>
  );
}

export { SignIn };
