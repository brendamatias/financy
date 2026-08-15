import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { authHandlers } from "@/mocks/api/auth";
import { categoryHandlers } from "@/mocks/api/category";
import { dashboardHandlers } from "@/mocks/api/dashboard";
import { transactionHandlers } from "@/mocks/api/transaction";
import { userHandlers } from "@/mocks/api/user";
import { resetDb } from "@/mocks/data";
import { apolloClient } from "@/services/apollo";
import { useAuthStore } from "@/stores/auth";

export const server = setupServer(
  ...authHandlers,
  ...categoryHandlers,
  ...dashboardHandlers,
  ...transactionHandlers,
  ...userHandlers,
);

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;

Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};
Element.prototype.scrollIntoView = () => {};

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(async () => {
  server.resetHandlers();
  resetDb();
  cleanup();
  localStorage.clear();
  await apolloClient.clearStore();

  useAuthStore.setState({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

afterAll(() => {
  server.close();
});
