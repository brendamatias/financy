import { createBrowserRouter } from "react-router-dom";

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

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    element: <DefaultLayout />,
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
