import { HttpResponse, delay } from "msw";

import { db } from "@/mocks/data";
import { api } from "@/mocks/graphql";

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
