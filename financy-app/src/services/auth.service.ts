import { api } from "./api";

const DOMAIN = "auth";

const signIn = (payload: SignInRequest): Promise<AuthResponse> => {
  return api.post(`${DOMAIN}/sign-in`, payload);
};

const signUp = (payload: SignUpRequest): Promise<AuthResponse> => {
  return api.post(`${DOMAIN}/sign-up`, payload);
};

const AuthService = {
  signIn,
  signUp,
};

export { AuthService };
