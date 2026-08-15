import { Field, InputType } from "type-graphql";

@InputType()
export class DashboardSummaryInput {
  @Field(() => String, { nullable: true })
  period?: string;
}
