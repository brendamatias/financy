import { HttpResponse, delay, graphql } from "msw";

import { db } from "@/mocks/data";

const api = graphql.link(import.meta.env.VITE_GRAPHQL_URL);

function withTypename(user: User) {
  return { __typename: "UserModel", ...user };
}

export const userHandlers = [
  api.query<MeResponse>("Me", async () => {
    await delay(200);

    return HttpResponse.json({ data: { me: withTypename(db.user) } });
  }),

  api.mutation<UpdateMeResponse, { data: UpdateUserRequest }>(
    "UpdateMe",
    async ({ variables }) => {
      await delay(400);

      db.user = {
        ...db.user,
        ...variables.data,
        updatedAt: new Date().toISOString(),
      };

      return HttpResponse.json({
        data: { updateMe: withTypename(db.user) },
      });
    },
  ),
];
