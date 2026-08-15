import {
  BookOpen,
  BriefcaseBusiness,
  Bubbles,
  CarFront,
  CreditCard,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  PiggyBank,
  ReceiptText,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Ticket,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<CategoryIconName, LucideIcon> = {
  briefcase: BriefcaseBusiness,
  car: CarFront,
  health: HeartPulse,
  investment: PiggyBank,
  market: ShoppingCart,
  entertainment: Ticket,
  basket: ShoppingBasket,
  food: Utensils,
  cleaning: Bubbles,
  house: House,
  gift: Gift,
  gym: Dumbbell,
  education: BookOpen,
  bag: ShoppingBag,
  card: CreditCard,
  bill: ReceiptText,
  energy: Zap,
};

function getCategoryIcon(name: CategoryIconName): LucideIcon {
  return categoryIcons[name] ?? ReceiptText;
}

export { categoryIcons, getCategoryIcon };
