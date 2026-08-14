import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
} from "@/services/graphql/mutations/auth";
import { apolloClient } from "@/services/apollo";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<boolean>;
  signUp: (data: RegisterRequest) => Promise<boolean>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      signIn: async (data) => {
        set({ isLoading: true });

        try {
          const response = await apolloClient.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              data: {
                email: data.email,
                password: data.password,
              },
            },
          });

          const login = response.data?.login;

          if (!login) {
            return false;
          }

          set({
            token: login.token,
            user: login.user,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Ocorreu um erro. Tente novamente.",
          );

          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (data) => {
        set({ isLoading: true });

        try {
          const response = await apolloClient.mutate({
            mutation: REGISTER_MUTATION,
            variables: {
              data: {
                name: data.name,
                email: data.email,
                password: data.password,
              },
            },
          });

          const register = response.data?.register;

          if (!register) {
            return false;
          }

          const { token, user } = register;

          set({
            token,
            user,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Ocorreu um erro. Tente novamente.",
          );

          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: () => {
        set({ token: null, user: null, isAuthenticated: false });
        apolloClient.clearStore();
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: "financy:auth",
      partialize: ({ token, user, isAuthenticated }) => ({
        token,
        user,
        isAuthenticated,
      }),
    },
  ),
);
