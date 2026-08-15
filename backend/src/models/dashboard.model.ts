import { Field, Float, ObjectType } from "type-graphql";

@ObjectType()
export class DashboardSummaryModel {
  @Field(() => Float)
  balance!: number;

  @Field(() => Float)
  income!: number;

  @Field(() => Float)
  expenses!: number;
}
