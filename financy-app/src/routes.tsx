import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import { Login } from "@/pages/login";
import { SignUp } from "@/pages/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/components",
    element: <App />,
  },
]);
