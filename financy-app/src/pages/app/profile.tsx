import { LogOut, Mail, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { Separator } from "@/components/ui/separator";

const user = {
  name: "Conta teste",
  email: "conta@teste.com",
  initials: "CT",
};

function Profile() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Card className="mx-auto flex w-full max-w-md flex-col gap-8 p-8">
      <div className="flex flex-col items-center gap-6">
        <Avatar size="xl">
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center">
          <strong className="text-xl font-bold text-gray-800">
            {user.name}
          </strong>
          <span className="text-base text-gray-500">{user.email}</span>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Nome completo"
          name="name"
          autoComplete="name"
          defaultValue={user.name}
          icon={<UserRound />}
        />

        <InputField
          label="E-mail"
          name="email"
          type="email"
          defaultValue={user.email}
          helperText="O e-mail não pode ser alterado"
          icon={<Mail />}
          disabled
        />

        <Button type="submit" className="mt-4 w-full">
          Salvar alterações
        </Button>

        <Button type="button" variant="outline" className="w-full">
          <LogOut className="text-danger" />
          Sair da conta
        </Button>
      </form>
    </Card>
  );
}

export { Profile };
