interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthPayload {
  token: string;
  refreshToken: string;
  user: User;
}

interface LoginResponse {
  login: AuthPayload;
}

interface RegisterResponse {
  register: AuthPayload;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  refreshToken: AuthPayload;
}
