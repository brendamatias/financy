import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from "type-graphql";
import { UserModel } from "./user.model";

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  color!: string;

  @Field(() => String)
  icon!: string;

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
