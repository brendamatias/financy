import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { DashboardSummaryInput } from "../dtos/input/dashboard.input";
import { User } from "../generated/prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { IsAuth } from "../middlewares/auth.middleware";
import { DashboardSummaryModel } from "../models/dashboard.model";
import { DashboardService } from "../services/dashboard.service";

@Resolver(() => DashboardSummaryModel)
@UseMiddleware(IsAuth)
export class DashboardResolver {
  private dashboardService = new DashboardService();

  @Query(() => DashboardSummaryModel)
  async getDashboardSummary(
    @Arg("data", () => DashboardSummaryInput, { nullable: true })
    data: DashboardSummaryInput,
    @GqlUser() user: User,
  ): Promise<DashboardSummaryModel> {
    return this.dashboardService.getSummary(data ?? {}, user.id);
  }
}
