import { describe, expect, it } from "vitest";

import { HttpResponse, graphql } from "msw";

import { db } from "@/mocks/data";
import { useAuthStore } from "@/stores/auth";
import { server } from "@/tests/setup";

const api = graphql.link(import.meta.env.VITE_GRAPHQL_URL);

const credentials = {
  email: db.user.email,
  password: "12345678",
};

describe("authStore.signIn", () => {
  it("stores the session when the credentials are valid", async () => {
    const success = await useAuthStore.getState().signIn(credentials);

    const { token, user, isAuthenticated } = useAuthStore.getState();

    expect(success).toBe(true);
    expect(isAuthenticated).toBe(true);
    expect(token).toBeTruthy();
    expect(user?.email).toBe(credentials.email);
  });

  it("keeps the user signed out when the password is wrong", async () => {
    const success = await useAuthStore.getState().signIn({
      ...credentials,
      password: "wrong-password",
    });

    const { token, user, isAuthenticated } = useAuthStore.getState();

    expect(success).toBe(false);
    expect(isAuthenticated).toBe(false);
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it("turns the loading flag off after finishing", async () => {
    await useAuthStore.getState().signIn(credentials);

    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("persists the session so a reload keeps the user signed in", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    const persisted = JSON.parse(localStorage.getItem("financy:auth") ?? "{}");

    expect(persisted.state.isAuthenticated).toBe(true);
    expect(persisted.state.token).toBeTruthy();
    expect(persisted.state.isLoading).toBeUndefined();
  });
});

describe("authStore.signUp", () => {
  it("creates the account and signs the user in", async () => {
    const success = await useAuthStore.getState().signUp({
      name: "Nova Conta",
      email: "nova@teste.com",
      password: "12345678",
    });

    const { user, isAuthenticated } = useAuthStore.getState();

    expect(success).toBe(true);
    expect(isAuthenticated).toBe(true);
    expect(user?.name).toBe("Nova Conta");
    expect(user?.email).toBe("nova@teste.com");
  });
});

describe("authStore rememberMe", () => {
  it("keeps the session in localStorage when the user asks to be remembered", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    expect(localStorage.getItem("financy:auth")).toBeTruthy();
    expect(sessionStorage.getItem("financy:auth")).toBeNull();
  });

  it("keeps the session only in sessionStorage by default", async () => {
    await useAuthStore.getState().signIn(credentials);

    expect(sessionStorage.getItem("financy:auth")).toBeTruthy();
    expect(localStorage.getItem("financy:auth")).toBeNull();
  });

  it("moves the session when the choice changes", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    expect(localStorage.getItem("financy:auth")).toBeTruthy();

    useAuthStore.getState().signOut();
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: false });

    expect(localStorage.getItem("financy:auth")).toBeNull();
    expect(sessionStorage.getItem("financy:auth")).toBeTruthy();
  });

  it("remembers the email of the last sign in", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    expect(useAuthStore.getState().rememberedEmail).toBe(credentials.email);
    expect(localStorage.getItem("financy:remembered-email")).toBe(
      credentials.email,
    );
  });

  it("does not remember the email when the checkbox is off", async () => {
    await useAuthStore.getState().signIn(credentials);

    expect(useAuthStore.getState().rememberedEmail).toBe("");
    expect(localStorage.getItem("financy:remembered-email")).toBeNull();
  });

  it("keeps the email after signing out", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    useAuthStore.getState().signOut();

    expect(localStorage.getItem("financy:remembered-email")).toBe(
      credentials.email,
    );
  });

  it("forgets the email when the user signs in without the checkbox", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    useAuthStore.getState().signOut();

    await useAuthStore.getState().signIn(credentials);

    expect(localStorage.getItem("financy:remembered-email")).toBeNull();
  });

  it("keeps the preference after signing out", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    useAuthStore.getState().signOut();

    expect(useAuthStore.getState().rememberMe).toBe(true);
    expect(localStorage.getItem("financy:remember-me")).toBe("true");
  });

  it("clears both storages when signing out", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    useAuthStore.getState().signOut();

    expect(localStorage.getItem("financy:auth")).toBeNull();
    expect(sessionStorage.getItem("financy:auth")).toBeNull();
  });

  it("forgets the preference when the user signs in without it", async () => {
    await useAuthStore.getState().signIn({ ...credentials, rememberMe: true });

    useAuthStore.getState().signOut();

    await useAuthStore.getState().signIn({ ...credentials, rememberMe: false });

    expect(useAuthStore.getState().rememberMe).toBe(false);
    expect(localStorage.getItem("financy:remember-me")).toBe("false");
  });
});

describe("authStore.signOut", () => {
  it("clears the session", async () => {
    await useAuthStore.getState().signIn(credentials);

    useAuthStore.getState().signOut();

    const { token, user, isAuthenticated } = useAuthStore.getState();

    expect(isAuthenticated).toBe(false);
    expect(token).toBeNull();
    expect(user).toBeNull();
  });
});

describe("authStore.refreshSession", () => {
  it("does nothing when there is no refresh token", async () => {
    const token = await useAuthStore.getState().refreshSession();

    expect(token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("replaces the tokens of the session", async () => {
    await useAuthStore.getState().signIn(credentials);

    const previous = useAuthStore.getState();
    const token = await useAuthStore.getState().refreshSession();

    const current = useAuthStore.getState();

    expect(token).toBeTruthy();
    expect(current.token).not.toBe(previous.token);
    expect(current.refreshToken).not.toBe(previous.refreshToken);
    expect(current.isAuthenticated).toBe(true);
  });

  it("keeps the session when the refresh fails", async () => {
    await useAuthStore.getState().signIn(credentials);

    server.use(
      api.mutation("RefreshToken", () =>
        HttpResponse.json({
          errors: [{ message: "Sessão expirada. Faça login novamente." }],
        }),
      ),
    );

    const token = await useAuthStore.getState().refreshSession();

    expect(token).toBeNull();
  });

  it("stores the refresh token when signing in", async () => {
    await useAuthStore.getState().signIn(credentials);

    expect(useAuthStore.getState().refreshToken).toBeTruthy();
  });

  it("clears the refresh token when signing out", async () => {
    await useAuthStore.getState().signIn(credentials);

    useAuthStore.getState().signOut();

    expect(useAuthStore.getState().refreshToken).toBeNull();
  });
});
