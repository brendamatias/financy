import { Field, InputType } from "type-graphql";

import { CategoryColor, CategoryIcon } from "../../graphql/enums";

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => CategoryColor)
  color!: CategoryColor;

  @Field(() => CategoryIcon)
  icon!: CategoryIcon;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => CategoryColor, { nullable: true })
  color?: CategoryColor;

  @Field(() => CategoryIcon, { nullable: true })
  icon?: CategoryIcon;
}
