import { Field, Int, ObjectType } from "type-graphql";
import { CategoryModel } from "./category.model";

@ObjectType()
export class CategoriesSummaryModel {
  @Field(() => Int)
  categoriesCount!: number;

  @Field(() => Int)
  transactionsCount!: number;

  @Field(() => CategoryModel, { nullable: true })
  mostUsed?: CategoryModel | null;
}
