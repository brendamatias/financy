import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { REQUEST_PASSWORD_RESET_MUTATION } from "@/lib/graphql";

const schema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail")
    .pipe(z.email("Informe um e-mail válido")),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

function ForgotPassword() {
  const [requestPasswordReset, { loading: isPending, data }] = useMutation(
    REQUEST_PASSWORD_RESET_MUTATION,
    {
      onError: (error) => toast.error(error.message),
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordFormData) {
    requestPasswordReset({ variables: { data: values } });
  }

  if (data?.requestPasswordReset) {
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-gray-200 text-brand-base">
          <MailCheck className="size-8" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Verifique seu e-mail
          </h1>
          <p className="mt-1 text-base text-gray-600">
            Se existir uma conta com esse e-mail, você receberá um link para
            criar uma nova senha.
          </p>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <RouterLink to="/sign-in">
            <ArrowLeft />
            Voltar para o login
          </RouterLink>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Recuperar senha</h1>
        <p className="mt-1 text-base text-gray-600">
          Informe seu e-mail e enviaremos um link para criar uma nova senha
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        <InputField
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="mail@exemplo.com"
          icon={<Mail />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar link"}
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

export { ForgotPassword };
