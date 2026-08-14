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

function categoryRef(id: string) {
  const category = categories.find((item) => item.id === id) ?? categories[0];

  return {
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
  };
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Pagamento de Salário",
    date: "2025-12-01",
    amount: 4250,
    type: "income",
    category: categoryRef("5"),
  },
  {
    id: "2",
    description: "Jantar no Restaurante",
    date: "2025-11-30",
    amount: 89.5,
    type: "expense",
    category: categoryRef("1"),
  },
  {
    id: "3",
    description: "Posto de Gasolina",
    date: "2025-11-29",
    amount: 100,
    type: "expense",
    category: categoryRef("7"),
  },
  {
    id: "4",
    description: "Compras no Mercado",
    date: "2025-11-28",
    amount: 156.8,
    type: "expense",
    category: categoryRef("4"),
  },
  {
    id: "5",
    description: "Retorno de Investimento",
    date: "2025-11-26",
    amount: 340.25,
    type: "income",
    category: categoryRef("3"),
  },
  {
    id: "6",
    description: "Aluguel",
    date: "2025-11-26",
    amount: 1700,
    type: "expense",
    category: categoryRef("8"),
  },
  {
    id: "7",
    description: "Freelance",
    date: "2025-11-24",
    amount: 2500,
    type: "income",
    category: categoryRef("5"),
  },
  {
    id: "8",
    description: "Compras Jantar",
    date: "2025-11-22",
    amount: 150,
    type: "expense",
    category: categoryRef("4"),
  },
  {
    id: "9",
    description: "Cinema",
    date: "2025-11-18",
    amount: 88,
    type: "expense",
    category: categoryRef("2"),
  },
  {
    id: "10",
    description: "Farmácia",
    date: "2025-11-15",
    amount: 74.9,
    type: "expense",
    category: categoryRef("6"),
  },
  {
    id: "11",
    description: "Uber para o trabalho",
    date: "2025-11-12",
    amount: 32.4,
    type: "expense",
    category: categoryRef("7"),
  },
  {
    id: "12",
    description: "Internet",
    date: "2025-11-10",
    amount: 129.9,
    type: "expense",
    category: categoryRef("8"),
  },
];

const db = {
  categories,
  transactions,
};

export { categoryRef, db };
