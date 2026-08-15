import { Outlet } from "react-router-dom";

import logo from "@/assets/logo.svg";

function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center gap-8 px-4 py-16">
      <img src={logo} alt="Financy" />

      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}

export { AuthLayout };
