type CategoryColor =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow";

type CategoryIconName =
  | "briefcase"
  | "car"
  | "health"
  | "investment"
  | "market"
  | "entertainment"
  | "basket"
  | "food"
  | "cleaning"
  | "house"
  | "gift"
  | "gym"
  | "education"
  | "bag"
  | "card"
  | "bill"
  | "energy";

interface Category {
  __typename?: string;
  id: string;
  name: string;
  description: string;
  color: CategoryColor;
  icon: CategoryIconName;
  createdAt: string;
  updatedAt: string;
  transactionsCount?: number;
  total?: number;
}

interface CategoriesSummary {
  __typename?: string;
  categoriesCount: number;
  transactionsCount: number;
  mostUsed: Pick<Category, "__typename" | "name" | "color" | "icon"> | null;
}

interface CreateCategoryRequest {
  name: string;
  description: string;
  color: CategoryColor;
  icon: CategoryIconName;
}

interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: CategoryColor;
  icon?: CategoryIconName;
}

interface CategoriesResponse {
  getCategories: Category[];
}

interface CategoriesSummaryResponse {
  getCategoriesSummary: CategoriesSummary;
}

interface CreateCategoryResponse {
  createCategory: Category;
}

interface UpdateCategoryResponse {
  updateCategory: Category;
}

interface DeleteCategoryResponse {
  deleteCategory: boolean;
}
