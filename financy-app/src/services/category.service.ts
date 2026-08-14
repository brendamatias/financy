import { api } from "./api";

const DOMAIN = "categories";

const get = (): Promise<Category[]> => {
  return api.get(DOMAIN);
};

const getSummary = (): Promise<CategoriesSummary> => {
  return api.get(`${DOMAIN}/summary`);
};

const create = (payload: CreateCategoryRequest): Promise<void> => {
  return api.post(DOMAIN, payload);
};

const destroy = (id: string): Promise<void> => {
  return api.delete(`${DOMAIN}/${id}`);
};

const CategoryService = {
  get,
  create,
  destroy,
  summary: {
    get: getSummary,
  },
};

export { CategoryService };
