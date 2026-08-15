import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { CategoryModel } from "../models/category.model";
import { CategoriesSummaryModel } from "../models/category-summary.model";
import { CategoryService } from "../services/category.service";
import { IsAuth } from "../middlewares/auth.middleware";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "../generated/prisma/client";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService();
  private userService = new UserService();

  @Query(() => [CategoryModel])
  async listCategories(@GqlUser() user: User): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(user.id);
  }

  @Query(() => CategoriesSummaryModel)
  async getCategoriesSummary(
    @GqlUser() user: User,
  ): Promise<CategoriesSummaryModel> {
    return this.categoryService.getCategoriesSummary(user.id);
  }

  @Query(() => CategoryModel)
  async getCategory(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<CategoryModel> {
    return this.categoryService.findCategory(id, user.id);
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: User,
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id);
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, data, user.id);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<boolean> {
    return this.categoryService.deleteCategory(id, user.id);
  }

  @FieldResolver(() => UserModel)
  async user(@Root() category: CategoryModel): Promise<UserModel> {
    return this.userService.findUser(category.userId);
  }
}
