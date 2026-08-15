import { gql, type TypedDocumentNode } from "@apollo/client";

import { CATEGORY_FRAGMENT } from "../queries/categories";

export const REFETCH_CATEGORIES = ["ListCategories", "GetCategoriesSummary"];

export const CREATE_CATEGORY: TypedDocumentNode<
  CreateCategoryResponse,
  { data: CreateCategoryRequest }
> = gql`
  ${CATEGORY_FRAGMENT}

  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
`;

export const UPDATE_CATEGORY: TypedDocumentNode<
  UpdateCategoryResponse,
  { id: string; data: UpdateCategoryRequest }
> = gql`
  ${CATEGORY_FRAGMENT}

  mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
`;

export const DELETE_CATEGORY: TypedDocumentNode<
  DeleteCategoryResponse,
  { id: string }
> = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;
