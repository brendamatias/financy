import { HttpResponse, delay, http } from "msw";

import { db } from "@/mocks/data";

export const userHandlers = [
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
