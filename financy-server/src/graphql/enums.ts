import { registerEnumType } from "type-graphql";

import {
  CategoryColor,
  CategoryIcon,
  TransactionType,
} from "../generated/prisma/enums";

registerEnumType(CategoryColor, {
  name: "CategoryColor",
  description: "Cores disponíveis para uma categoria",
});

registerEnumType(CategoryIcon, {
  name: "CategoryIcon",
  description: "Ícones disponíveis para uma categoria",
});

registerEnumType(TransactionType, {
  name: "TransactionType",
  description: "Entrada ou saída",
});

export { CategoryColor, CategoryIcon, TransactionType };
