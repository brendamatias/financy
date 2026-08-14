import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import { SignIn } from "@/pages/sign-in";
import { SignUp } from "@/pages/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
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
