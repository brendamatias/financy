import { ApolloProvider } from "@apollo/client/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { apolloClient } from "@/lib/graphql";

export function renderWithRouter(
  element: React.ReactNode,
  { path = "/" }: { path?: string } = {},
) {
  const user = userEvent.setup();

  const routePath = path.split("?")[0];

  const result = render(
    <ApolloProvider client={apolloClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePath} element={element} />
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/sign-in" element={<h1>Fazer login</h1>} />
        </Routes>

        <Toaster />
      </MemoryRouter>
    </ApolloProvider>,
  );

  return { user, ...result };
}
