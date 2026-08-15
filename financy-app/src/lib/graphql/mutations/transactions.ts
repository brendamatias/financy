import { gql, type TypedDocumentNode } from "@apollo/client";

import { TRANSACTION_FRAGMENT } from "../queries/transactions";

export const REFETCH_TRANSACTIONS = [
  "ListTransactions",
  "ListTransactionPeriods",
  "ListCategories",
  "GetCategoriesSummary",
  "GetDashboardSummary",
];

export const CREATE_TRANSACTION: TypedDocumentNode<
  CreateTransactionResponse,
  { data: CreateTransactionRequest }
> = gql`
  ${TRANSACTION_FRAGMENT}

  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      ...TransactionFields
    }
  }
`;

export const DELETE_TRANSACTION: TypedDocumentNode<
  DeleteTransactionResponse,
  { id: string }
> = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`;
