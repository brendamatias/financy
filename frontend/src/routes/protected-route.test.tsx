import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ProtectedRoute } from "@/routes/protected-route";
import { useAuthStore } from "@/stores/auth";

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1>Conteúdo protegido</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/sign-in" element={<h1>Fazer login</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("sends the visitor to the sign in page", () => {
    renderGuard();

    expect(screen.getByRole("heading", { name: "Fazer login" })).toBeVisible();
    expect(screen.queryByText("Conteúdo protegido")).toBeNull();
  });

  it("renders the content for a signed in user", () => {
    useAuthStore.setState({ isAuthenticated: true, token: "token" });

    renderGuard();

    expect(screen.getByText("Conteúdo protegido")).toBeVisible();
  });

  it("sends the user out as soon as the session ends", () => {
    useAuthStore.setState({ isAuthenticated: true, token: "token" });

    const { rerender } = renderGuard();

    useAuthStore.getState().signOut();

    rerender(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Conteúdo protegido</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<h1>Fazer login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Fazer login" })).toBeVisible();
  });
});
