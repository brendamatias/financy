import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import {
  CreateTransactionInput,
  ListTransactionsInput,
  UpdateTransactionInput,
} from "../dtos/input/transaction.input";
import { User } from "../generated/prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { IsAuth } from "../middlewares/auth.middleware";
import { PaginatedTransactionsModel } from "../models/pagination.model";
import { TransactionModel } from "../models/transaction.model";
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

  @Query(() => TransactionModel)
  async getTransaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<TransactionModel> {
    return this.transactionService.findTransaction(id, user.id);
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: User,
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(data, user.id);
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: User,
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(id, data, user.id);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<boolean> {
    return this.transactionService.deleteTransaction(id, user.id);
  }
}
