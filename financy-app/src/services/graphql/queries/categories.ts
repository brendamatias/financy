import { gql, type TypedDocumentNode } from "@apollo/client";

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryFields on CategoryModel {
    id
    name
    description
    color
    icon
    createdAt
    updatedAt
  }
`;

export const LIST_CATEGORIES: TypedDocumentNode<CategoriesResponse> = gql`
  ${CATEGORY_FRAGMENT}

  query ListCategories {
    listCategories {
      ...CategoryFields
    }
  }
`;

export const GET_CATEGORY: TypedDocumentNode<
  CategoryResponse,
  { id: string }
> = gql`
  ${CATEGORY_FRAGMENT}

  query GetCategory($id: String!) {
    getCategory(id: $id) {
      ...CategoryFields
    }
  }
`;

export const GET_CATEGORIES_SUMMARY: TypedDocumentNode<CategoriesSummaryResponse> = gql`
  query GetCategoriesSummary {
    getCategoriesSummary {
      categoriesCount
      transactionsCount
      mostUsed {
        name
        color
        icon
      }
    }
  }
`;
