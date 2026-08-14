import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "@/App";
import { AuthLayout, DefaultLayout } from "@/layouts";
import {
  Categories,
  Dashboard,
  Profile,
  SignIn,
  SignUp,
  Transactions,
} from "@/pages";
import { ProtectedRoute } from "./protected-route";
import { PublicRoute } from "./public-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/components",
        element: <App />,
      },
    ],
  },
]);
