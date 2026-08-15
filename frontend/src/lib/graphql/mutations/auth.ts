import { gql, type TypedDocumentNode } from "@apollo/client";

export const LOGIN_MUTATION: TypedDocumentNode<
  LoginResponse,
  { data: LoginRequest }
> = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_MUTATION: TypedDocumentNode<
  RegisterResponse,
  { data: RegisterRequest }
> = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION: TypedDocumentNode<
  RefreshTokenResponse,
  { data: RefreshTokenRequest }
> = gql`
  mutation RefreshToken($data: RefreshTokenInput!) {
    refreshToken(data: $data) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET_MUTATION: TypedDocumentNode<
  RequestPasswordResetResponse,
  { data: RequestPasswordResetRequest }
> = gql`
  mutation RequestPasswordReset($data: RequestPasswordResetInput!) {
    requestPasswordReset(data: $data)
  }
`;

export const RESET_PASSWORD_MUTATION: TypedDocumentNode<
  ResetPasswordResponse,
  { data: ResetPasswordRequest }
> = gql`
  mutation ResetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data)
  }
`;
