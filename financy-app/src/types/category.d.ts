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
  id: string;
  name: string;
  description: string;
  color: CategoryColor;
  icon: CategoryIconName;
  transactionsCount: number;
  total: number;
}

type CategoryRecord = Omit<Category, "transactionsCount" | "total">;

interface CategoriesSummary {
  categoriesCount: number;
  transactionsCount: number;
  mostUsed: Pick<Category, "name" | "color" | "icon"> | null;
}

interface CreateCategoryRequest {
  name: string;
  description: string;
  color: CategoryColor;
  icon: CategoryIconName;
}
