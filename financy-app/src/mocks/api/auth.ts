import { HttpResponse, delay, http } from "msw";

import { db } from "@/mocks/data";

export const authHandlers = [
  http.post("/api/auth/sign-in", async ({ request }) => {
    await delay(600);

    const { email, password } = (await request.json()) as SignInRequest;

    if (email !== db.user.email || password !== db.credentials.password) {
      return HttpResponse.json(
        { message: "E-mail ou senha inválidos." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token: crypto.randomUUID(),
      user: db.user,
    } satisfies AuthResponse);
  }),

  http.post("/api/auth/sign-up", async ({ request }) => {
    await delay(600);

    const { name, email, password } = (await request.json()) as SignUpRequest;

    db.user = { id: crypto.randomUUID(), name, email };
    db.credentials.password = password;

    return HttpResponse.json(
      {
        token: crypto.randomUUID(),
        user: db.user,
      } satisfies AuthResponse,
      { status: 201 },
    );
  }),

  http.get("/api/me", async () => {
    await delay(200);

    return HttpResponse.json(db.user);
  }),

  http.put("/api/me", async ({ request }) => {
    await delay(400);

    const { name } = (await request.json()) as { name: string };

    db.user = { ...db.user, name };

    return HttpResponse.json(db.user);
  }),
];
