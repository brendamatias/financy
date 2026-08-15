import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { ListTransactionsInput } from "../dtos/input/transaction.input";
import { User } from "../generated/prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { IsAuth } from "../middlewares/auth.middleware";
import { PaginatedTransactionsModel } from "../models/pagination.model";
import { TransactionService } from "../services/transaction.service";

@Resolver(() => PaginatedTransactionsModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService();

  @Query(() => PaginatedTransactionsModel)
  async listTransactions(
    @Arg("data", () => ListTransactionsInput, { nullable: true })
    data: ListTransactionsInput,
    @GqlUser() user: User,
  ): Promise<PaginatedTransactionsModel> {
    return this.transactionService.listTransactions(data ?? {}, user.id);
  }

  @Query(() => [String])
  async listTransactionPeriods(@GqlUser() user: User): Promise<string[]> {
    return this.transactionService.listPeriods(user.id);
  }
}
