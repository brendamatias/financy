import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UpdateUserInput } from "../dtos/input/user.input";
import { User } from "../generated/prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { IsAuth } from "../middlewares/auth.middleware";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  private userService = new UserService();

  @Query(() => UserModel)
  async me(@GqlUser() user: User): Promise<UserModel> {
    return this.userService.findUser(user.id);
  }

  @Mutation(() => UserModel)
  async updateMe(
    @Arg("data", () => UpdateUserInput) data: UpdateUserInput,
    @GqlUser() user: User,
  ): Promise<UserModel> {
    return this.userService.updateUser(data, user.id);
  }
}
