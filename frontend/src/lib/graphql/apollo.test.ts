import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { db } from "@/mocks/data";
import { api } from "@/mocks/graphql";
import { apolloClient } from "@/lib/graphql/apollo";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories";
import { useAuthStore } from "@/stores/auth";
import { server } from "@/tests/setup";

const credentials = { email: db.user.email, password: "12345678" };

function failFirstCall() {
  let calls = 0;

  server.use(
    api.query("ListCategories", () => {
      calls += 1;

      if (calls === 1) {
        return HttpResponse.json({
          errors: [{ message: "Usuário não autenticado" }],
        });
      }

      return HttpResponse.json({
        data: {
          listCategories: db.categories.map((category) => ({
            __typename: "CategoryModel",
            ...category,
          })),
        },
      });
    }),
  );

  return () => calls;
}

describe("apollo refresh link", () => {
  it("renews the token and repeats the request that failed", async () => {
    await useAuthStore.getState().signIn(credentials);

    const tokenBefore = useAuthStore.getState().token;
    const calls = failFirstCall();

    const result = await apolloClient.query({
      query: LIST_CATEGORIES,
      fetchPolicy: "network-only",
    });

    expect(calls()).toBe(2);
    expect(result.data?.listCategories.length).toBe(db.categories.length);
    expect(useAuthStore.getState().token).not.toBe(tokenBefore);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("signs the user out when the refresh fails", async () => {
    await useAuthStore.getState().signIn(credentials);

    server.use(
      api.query("ListCategories", () =>
        HttpResponse.json({ errors: [{ message: "Usuário não autenticado" }] }),
      ),
      api.mutation("RefreshToken", () =>
        HttpResponse.json({
          errors: [{ message: "Sessão expirada. Faça login novamente." }],
        }),
      ),
    );

    await expect(
      apolloClient.query({
        query: LIST_CATEGORIES,
        fetchPolicy: "network-only",
      }),
    ).rejects.toBeDefined();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("does not try to refresh when there is no session", async () => {
    server.use(
      api.query("ListCategories", () =>
        HttpResponse.json({ errors: [{ message: "Usuário não autenticado" }] }),
      ),
    );

    await expect(
      apolloClient.query({
        query: LIST_CATEGORIES,
        fetchPolicy: "network-only",
      }),
    ).rejects.toBeDefined();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("sends the token of the session in the header", async () => {
    await useAuthStore.getState().signIn(credentials);

    let authorization: string | null = null;

    server.use(
      api.query("ListCategories", ({ request }) => {
        authorization = request.headers.get("authorization");

        return HttpResponse.json({ data: { listCategories: [] } });
      }),
    );

    await apolloClient.query({
      query: LIST_CATEGORIES,
      fetchPolicy: "network-only",
    });

    expect(authorization).toBe(`Bearer ${useAuthStore.getState().token}`);
  });
});
