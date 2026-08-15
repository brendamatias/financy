import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { RESET_PASSWORD_MUTATION } from "@/lib/graphql";

const schema = z
  .object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    passwordConfirmation: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "As senhas não conferem",
  });

type ResetPasswordFormData = z.infer<typeof schema>;

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [resetPassword, { loading: isPending }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        toast.success("Senha alterada com sucesso.");
        navigate("/sign-in", { replace: true });
      },
      onError: (error) => toast.error(error.message),
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  function onSubmit({ password }: ResetPasswordFormData) {
    resetPassword({ variables: { data: { token, password } } });
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-8 text-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Link de recuperação inválido
          </h1>
          <p className="mt-1 text-base text-gray-600">
            Peça um novo link para criar sua senha.
          </p>
        </div>

        <Button className="w-full" asChild>
          <RouterLink to="/forgot-password">Pedir um novo link</RouterLink>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Criar nova senha</h1>
        <p className="mt-1 text-base text-gray-600">
          Escolha uma nova senha para acessar sua conta
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <InputField
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            placeholder="Digite sua nova senha"
            icon={<Lock />}
            error={errors.password?.message}
            helperText="A senha deve ter no mínimo 8 caracteres"
            {...register("password")}
          />

          <InputField
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            placeholder="Repita sua nova senha"
            icon={<Lock />}
            error={errors.passwordConfirmation?.message}
            {...register("passwordConfirmation")}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar nova senha"}
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <RouterLink to="/sign-in">
              <ArrowLeft />
              Voltar para o login
            </RouterLink>
          </Button>
        </div>
      </form>
    </>
  );
}

export { ResetPassword };
