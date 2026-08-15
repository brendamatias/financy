import { createParameterDecorator, ResolverData } from "type-graphql";
import { GraphqlContext } from "../context";
import { UserModel } from "../../models/user.model";
import { prismaClient } from "../../../prisma/prisma";

export const GqlUser = () => {
  return createParameterDecorator(
    async ({
      context,
    }: ResolverData<GraphqlContext>): Promise<UserModel | null> => {
      if (!context?.user) return null;

      return prismaClient.user.findUnique({
        where: {
          id: context.user,
        },
      });
    },
  );
};
