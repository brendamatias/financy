import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class RefreshTokenInput {
  @Field(() => String)
  refreshToken!: string;
}

@InputType()
export class RequestPasswordResetInput {
  @Field(() => String)
  email!: string;
}

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  token!: string;

  @Field(() => String)
  password!: string;
}
