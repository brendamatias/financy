import { describe, expect, it } from "vitest";

import { db } from "@/mocks/data";
import { useAuthStore } from "@/stores/auth";

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
    await useAuthStore.getState().signIn(credentials);

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
