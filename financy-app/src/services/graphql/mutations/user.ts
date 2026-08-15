import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FRAGMENT } from "../queries/user";

export const UPDATE_ME: TypedDocumentNode<
  UpdateMeResponse,
  { data: UpdateUserRequest }
> = gql`
  ${USER_FRAGMENT}

  mutation UpdateMe($data: UpdateUserInput!) {
    updateMe(data: $data) {
      ...UserFields
    }
  }
`;
