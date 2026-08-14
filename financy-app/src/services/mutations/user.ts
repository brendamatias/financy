import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@/stores/auth";
import { UserService } from "../user.service";

export const useUpdateUser = () => {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: { name: string }) => UserService.update(payload),
    onSuccess: (user) => {
      updateUser(user);
      toast.success("Perfil atualizado com sucesso.");
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });
};
