import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/initials";
import { UPDATE_ME } from "@/lib/graphql";
import { useAuthStore } from "@/stores/auth";

const schema = z.object({
  name: z.string().min(1, "Informe seu nome completo"),
});

type ProfileFormData = z.infer<typeof schema>;

function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const updateStoredUser = useAuthStore((state) => state.updateUser);
  const [updateUser, { loading: isPending }] = useMutation(UPDATE_ME, {
    onCompleted: ({ updateMe }) => {
      updateStoredUser(updateMe);
      toast.success("Perfil atualizado com sucesso.");
    },
    onError: (error) => toast.error(error.message),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  function onSubmit(data: ProfileFormData) {
    updateUser({ variables: { data } });
  }

  function handleSignOut() {
    signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <Card className="mx-auto flex w-full max-w-md flex-col gap-8 md:p-8">
      <div className="flex flex-col items-center gap-6">
        <Avatar size="xl">
          <AvatarFallback>{getInitials(user?.name ?? "")}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center text-center">
          <strong className="text-xl font-bold text-gray-800">
            {user?.name}
          </strong>
          <span className="text-base text-gray-500">{user?.email}</span>
        </div>
      </div>

      <Separator />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <InputField
          label="Nome completo"
          autoComplete="name"
          icon={<UserRound />}
          error={errors.name?.message}
          {...register("name")}
        />

        <InputField
          label="E-mail"
          type="email"
          defaultValue={user?.email}
          helperText="O e-mail não pode ser alterado"
          icon={<Mail />}
          disabled
        />

        <Button type="submit" className="mt-4 w-full" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="text-danger" />
          Sair da conta
        </Button>
      </form>
    </Card>
  );
}

export { Profile };
