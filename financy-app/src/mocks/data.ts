const categories: Category[] = [
  {
    id: "1",
    name: "Alimentação",
    description: "Restaurantes, delivery e refeições",
    color: "blue",
    icon: "food",
    transactionsCount: 12,
  },
  {
    id: "2",
    name: "Entretenimento",
    description: "Cinema, jogos e lazer",
    color: "pink",
    icon: "entertainment",
    transactionsCount: 2,
  },
  {
    id: "3",
    name: "Investimento",
    description: "Aplicações e retornos financeiros",
    color: "green",
    icon: "investment",
    transactionsCount: 1,
  },
  {
    id: "4",
    name: "Mercado",
    description: "Compras de supermercado e mantimentos",
    color: "orange",
    icon: "market",
    transactionsCount: 3,
  },
  {
    id: "5",
    name: "Salário",
    description: "Renda mensal e bonificações",
    color: "green",
    icon: "briefcase",
    transactionsCount: 3,
  },
  {
    id: "6",
    name: "Saúde",
    description: "Medicamentos, consultas e exames",
    color: "red",
    icon: "health",
    transactionsCount: 0,
  },
  {
    id: "7",
    name: "Transporte",
    description: "Gasolina, transporte público e viagens",
    color: "purple",
    icon: "car",
    transactionsCount: 8,
  },
  {
    id: "8",
    name: "Utilidades",
    description: "Energia, água, internet e telefone",
    color: "yellow",
    icon: "energy",
    transactionsCount: 7,
  },
];

const db = {
  categories,
};

export { db };
