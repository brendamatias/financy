import { NavLink, Outlet } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import logo from "@/assets/logo.svg";

const navigation = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Transações", to: "/transactions" },
  { label: "Categorias", to: "/categories" },
];

function DefaultLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-17.25 w-full justify-between items-center gap-4 px-12 py-4">
          <img src={logo} alt="Financy" className="h-6 w-auto" />

          <nav className="flex items-center gap-5">
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

          <NavLink to="/profile" aria-label="Perfil">
            <Avatar>
              <AvatarFallback>CT</AvatarFallback>
            </Avatar>
          </NavLink>
        </div>
      </header>

      <main className="w-full flex-1 p-12">
        <Outlet />
      </main>
    </div>
  );
}

export { DefaultLayout };
