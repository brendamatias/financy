import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@/stores/auth";
import { AuthService } from "../auth.service";

export const useSignIn = () => {
  const signIn = useAuthStore((state) => state.signIn);

  return useMutation({
    mutationFn: (payload: SignInRequest) => AuthService.signIn(payload),
    onSuccess: (data) => {
      signIn(data);
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });
};

export const useSignUp = () => {
  const signIn = useAuthStore((state) => state.signIn);

  return useMutation({
    mutationFn: (payload: SignUpRequest) => AuthService.signUp(payload),
    onSuccess: (data) => {
      signIn(data);
      toast.success("Conta criada com sucesso.");
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });
};
