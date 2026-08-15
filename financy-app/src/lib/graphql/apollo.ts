import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  Observable,
  from,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";

import { useAuthStore } from "@/stores/auth";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

const authLink: SetContextLink = new SetContextLink(({ headers }) => {
  const token = useAuthStore.getState().token;

  return {
    headers: {
      ...(headers ?? {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

function isUnauthenticated(message?: string) {
  return message?.toLowerCase().includes("não autenticado") ?? false;
}

const refreshLink: ErrorLink = new ErrorLink(
  ({ error, operation, forward }) => {
    if (!isUnauthenticated(error?.message)) {
      return;
    }

    const { skipAuthRetry } = operation.getContext();

    if (skipAuthRetry) {
      useAuthStore.getState().signOut();
      return;
    }

    return new Observable((observer) => {
      useAuthStore
        .getState()
        .refreshSession()
        .then((token) => {
          if (!token) {
            useAuthStore.getState().signOut();
            observer.error(error);
            return;
          }

          operation.setContext(({ headers = {} }: { headers?: object }) => ({
            headers: { ...headers, authorization: `Bearer ${token}` },
          }));

          forward(operation).subscribe(observer);
        })
        .catch((refreshError) => {
          useAuthStore.getState().signOut();
          observer.error(refreshError);
        });
    });
  },
);

export const apolloClient: ApolloClient = new ApolloClient({
  link: from([refreshLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
