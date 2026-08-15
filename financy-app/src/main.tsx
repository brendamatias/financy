import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import { enableMocking } from "./mocks/browser";
import { apolloClient } from "./lib/graphql";
import { router } from "./routes";

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ApolloProvider client={apolloClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ApolloProvider>
    </StrictMode>,
  );
});
