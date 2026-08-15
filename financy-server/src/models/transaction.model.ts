import { Field, Float, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import {
  CategoryColor,
  CategoryIcon,
  TransactionType,
} from "../graphql/enums";
import { UserModel } from "./user.model";

@ObjectType()
export class TransactionCategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => CategoryColor)
  color!: CategoryColor;

  @Field(() => CategoryIcon)
  icon!: CategoryIcon;
}

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  description!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => String)
  categoryId!: string;

  @Field(() => TransactionCategoryModel, { nullable: true })
  category?: TransactionCategoryModel;

  @Field(() => String)
  userId!: string;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
