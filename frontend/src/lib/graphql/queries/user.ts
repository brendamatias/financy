import { gql, type TypedDocumentNode } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFields on UserModel {
    id
    name
    email
    createdAt
    updatedAt
  }
`;

export const GET_ME: TypedDocumentNode<MeResponse> = gql`
  ${USER_FRAGMENT}

  query Me {
    me {
      ...UserFields
    }
  }
`;
