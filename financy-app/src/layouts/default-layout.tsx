import { NavLink, Outlet } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/initials";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

import logo from "@/assets/logo.svg";

const navigation = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Transações", to: "/transactions" },
  { label: "Categorias", to: "/categories" },
];

function DefaultLayout() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 md:h-17.25 md:flex-nowrap md:px-12">
          <NavLink to="/dashboard" className="shrink-0">
            <img src={logo} alt="Financy" className="h-6 w-auto" />
          </NavLink>

          <NavLink to="/profile" aria-label="Perfil" className="md:order-3">
            <Avatar>
              <AvatarFallback>{getInitials(user?.name ?? "")}</AvatarFallback>
            </Avatar>
          </NavLink>

          <nav className="order-last flex w-full items-center justify-center gap-5 md:order-2 md:w-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm text-gray-600 font-medium transition-colors hover:text-brand-base",
                    isActive && "font-semibold text-brand-base",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="w-full flex-1 px-4 py-10 md:p-12">
        <Outlet />
      </main>
    </div>
  );
}

export { DefaultLayout };
