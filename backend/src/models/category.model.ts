import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from "type-graphql";
import { CategoryColor, CategoryIcon } from "../graphql/enums";
import { UserModel } from "./user.model";

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => CategoryColor)
  color!: CategoryColor;

  @Field(() => CategoryIcon)
  icon!: CategoryIcon;

  @Field(() => String)
  userId!: string;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => Int)
  transactionsCount!: number;

  @Field(() => Float)
  total!: number;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
