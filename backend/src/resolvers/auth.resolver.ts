import { Arg, Mutation, Resolver } from "type-graphql";
import {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from "../dtos/input/auth.input";
import { LoginOutput, RegisterOutput } from "../dtos/output/auth.output";
import { AuthService } from "../services/auth.service";

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => LoginOutput)
  async login(
    @Arg("data", () => LoginInput) data: LoginInput,
  ): Promise<LoginOutput> {
    return this.authService.login(data);
  }

  @Mutation(() => LoginOutput)
  async refreshToken(
    @Arg("data", () => RefreshTokenInput) data: RefreshTokenInput,
  ): Promise<LoginOutput> {
    return this.authService.refreshToken(data);
  }

  @Mutation(() => Boolean)
  async requestPasswordReset(
    @Arg("data", () => RequestPasswordResetInput)
    data: RequestPasswordResetInput,
  ): Promise<boolean> {
    return this.authService.requestPasswordReset(data);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg("data", () => ResetPasswordInput) data: ResetPasswordInput,
  ): Promise<boolean> {
    return this.authService.resetPassword(data);
  }

  @Mutation(() => RegisterOutput)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput,
  ): Promise<RegisterOutput> {
    return this.authService.register(data);
  }
}
