import { gql, type TypedDocumentNode } from "@apollo/client";

export const TRANSACTION_FRAGMENT = gql`
  fragment TransactionFields on TransactionModel {
    id
    description
    amount
    type
    date
    categoryId
    category {
      id
      name
      color
      icon
    }
    createdAt
    updatedAt
  }
`;

export const LIST_TRANSACTIONS: TypedDocumentNode<
  TransactionsResponse,
  { data: TransactionFilters }
> = gql`
  ${TRANSACTION_FRAGMENT}

  query ListTransactions($data: ListTransactionsInput) {
    listTransactions(data: $data) {
      data {
        ...TransactionFields
      }
      meta {
        page
        pageSize
        total
        totalPages
      }
    }
  }
`;

export const LIST_TRANSACTION_PERIODS: TypedDocumentNode<TransactionPeriodsResponse> = gql`
  query ListTransactionPeriods {
    listTransactionPeriods
  }
`;

export const GET_TRANSACTION: TypedDocumentNode<
  GetTransactionResponse,
  { id: string }
> = gql`
  ${TRANSACTION_FRAGMENT}

  query GetTransaction($id: String!) {
    getTransaction(id: $id) {
      ...TransactionFields
    }
  }
`;
