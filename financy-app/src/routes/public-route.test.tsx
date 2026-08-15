import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { PublicRoute } from "@/routes/public-route";
import { useAuthStore } from "@/stores/auth";

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={["/sign-in"]}>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <h1>Fazer login</h1>
            </PublicRoute>
          }
        />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PublicRoute", () => {
  it("renders the content for a visitor", () => {
    renderGuard();

    expect(screen.getByRole("heading", { name: "Fazer login" })).toBeVisible();
  });

  it("sends a signed in user to the dashboard", () => {
    useAuthStore.setState({ isAuthenticated: true, token: "token" });

    renderGuard();

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    expect(screen.queryByText("Fazer login")).toBeNull();
  });
});
