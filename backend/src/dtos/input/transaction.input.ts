import { Field, Float, InputType, Int } from "type-graphql";

import { TransactionType } from "../../graphql/enums";

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  date!: string;

  @Field(() => String)
  categoryId!: string;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  date?: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}

@InputType()
export class ListTransactionsInput {
  @Field(() => String, { nullable: true })
  searchQuery?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => String, { nullable: true })
  period?: string;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;
}
