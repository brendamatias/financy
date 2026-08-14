import { api } from "./api";

const DOMAIN = "me";

const get = (): Promise<User> => {
  return api.get(DOMAIN);
};

const update = (payload: { name: string }): Promise<User> => {
  return api.put(DOMAIN, payload);
};

const UserService = {
  get,
  update,
};

export { UserService };
