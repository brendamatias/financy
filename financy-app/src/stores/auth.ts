import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  apolloClient,
  LOGIN_MUTATION,
  REFRESH_TOKEN_MUTATION,
  REGISTER_MUTATION,
} from "@/lib/graphql";

const STORAGE_KEY = "financy:auth";

const REMEMBER_KEY = "financy:remember-me";
const REMEMBERED_EMAIL_KEY = "financy:remembered-email";

function readRememberPreference() {
  return localStorage.getItem(REMEMBER_KEY) === "true";
}

function readRememberedEmail() {
  return readRememberPreference()
    ? (localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "")
    : "";
}

function saveRememberPreference(remember: boolean, email: string) {
  localStorage.setItem(REMEMBER_KEY, String(remember));

  if (remember) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    return;
  }

  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

const sessionStorageAdapter: Storage = {
  ...sessionStorage,
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const remember = JSON.parse(value)?.state?.rememberMe;

    if (remember) {
      sessionStorage.removeItem(name);
      localStorage.setItem(name, value);
      return;
    }

    localStorage.removeItem(name);
    sessionStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  rememberedEmail: string;
  signIn: (data: LoginRequest & { rememberMe?: boolean }) => Promise<boolean>;
  signUp: (data: RegisterRequest) => Promise<boolean>;
  refreshSession: () => Promise<string | null>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: readRememberPreference(),
      rememberedEmail: readRememberedEmail(),

      signIn: async (data) => {
        const rememberMe = data.rememberMe ?? false;

        saveRememberPreference(rememberMe, data.email);
        set({
          isLoading: true,
          rememberMe,
          rememberedEmail: rememberMe ? data.email : "",
        });

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
            refreshToken: login.refreshToken,
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

          set({
            token: register.token,
            refreshToken: register.refreshToken,
            user: register.user,
            isAuthenticated: true,
          });

          toast.success("Conta criada com sucesso.");

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

      refreshSession: async () => {
        const currentRefreshToken = get().refreshToken;

        if (!currentRefreshToken) {
          return null;
        }

        try {
          const response = await apolloClient.mutate({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: { data: { refreshToken: currentRefreshToken } },
            context: { skipAuthRetry: true },
          });

          const refreshed = response.data?.refreshToken;

          if (!refreshed) {
            return null;
          }

          set({
            token: refreshed.token,
            refreshToken: refreshed.refreshToken,
            user: refreshed.user,
            isAuthenticated: true,
          });

          return refreshed.token;
        } catch {
          return null;
        }
      },

      signOut: () => {
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
        sessionStorageAdapter.removeItem(STORAGE_KEY);
        apolloClient.clearStore();
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorageAdapter),
      partialize: ({
        token,
        refreshToken,
        user,
        isAuthenticated,
        rememberMe,
      }) => ({
        token,
        refreshToken,
        user,
        isAuthenticated,
        rememberMe,
      }),
    },
  ),
);
