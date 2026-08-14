import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  color!: string;

  @Field(() => String)
  icon!: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  color?: string;

  @Field(() => String, { nullable: true })
  icon?: string;
}
