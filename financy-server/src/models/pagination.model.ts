import { Field, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "./transaction.model";

@ObjectType()
export class PaginationMetaModel {
  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class PaginatedTransactionsModel {
  @Field(() => [TransactionModel])
  data!: TransactionModel[];

  @Field(() => PaginationMetaModel)
  meta!: PaginationMetaModel;
}
