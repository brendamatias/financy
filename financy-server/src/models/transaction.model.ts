import { Field, Float, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import { UserModel } from "./user.model";

@ObjectType()
export class TransactionCategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  color!: string;

  @Field(() => String)
  icon!: string;
}

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  description!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => String)
  type!: string;

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
