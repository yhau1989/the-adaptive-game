"use client";

import Image from "next/image";
import { useState, type ComponentType } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  Gamepad2,
  LogOut,
  Menu,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UIDropdown } from "@repo/ui/dropdown";
import type { MenuProps } from "antd";
import { logoutAction } from "./actions";

type NavItem = {
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Juego",
    description: "Gestiona campañas y niveles",
    icon: Gamepad2,
  },
];

function MenuItemRow({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-violet-50">
      <Icon className="h-4 w-4 text-violet-500" />
      {children}
    </span>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(NAV_ITEMS[0]?.label);

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  const menuItems: NonNullable<MenuProps["items"]> = [
    {
      key: "profile-header",
      type: "group",
      label: (
        <span className="flex items-center gap-3 border-b border-zinc-200/80 px-4 py-3 text-sm font-medium text-slate-900">
          <Image
            src="https://i.pravatar.cc/60?img=32"
            alt="Avatar del usuario"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="flex flex-col">
            <span>Usuario Demo</span>
            <span className="text-xs font-normal text-slate-500">
              demo@adaptive.game
            </span>
          </span>
        </span>
      ),
    },
    { type: "divider" },
    {
      key: "account",
      label: <MenuItemRow icon={UserCog}>Cuenta</MenuItemRow>,
    },
    {
      key: "billing",
      label: <MenuItemRow icon={CreditCard}>Facturación</MenuItemRow>,
    },
    {
      key: "notifications",
      label: <MenuItemRow icon={Bell}>Notificaciones</MenuItemRow>,
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: (
        <form action={logoutAction} className="contents">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-4 py-2 text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </form>
      ),
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex min-h-screen flex-col bg-linear-to-b from-violet-900 via-violet-800 to-violet-900 text-violet-100 shadow-2xl",
        "transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-6",
          isCollapsed ? "justify-center" : "justify-start",
        )}
      >
        {!isCollapsed ? (
          <div>
            <p className="text-sm font-semibold">The Adaptive Game</p>
            <span className="text-xs text-violet-200/80">Panel principal</span>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className="absolute -right-3 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/60 bg-white text-violet-700 shadow-lg transition hover:bg-violet-50"
        aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="mt-6 flex flex-1 flex-col gap-2 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveItem(item.label)}
              className={cn(
                "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left text-sm transition",
                isCollapsed ? "justify-center" : "justify-start",
                isActive
                  ? "border-violet-400/70 bg-violet-700/60 shadow-inner"
                  : "hover:border-violet-400/30 hover:bg-violet-700/40",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 text-violet-100 transition",
                  isActive
                    ? "text-violet-50"
                    : "text-violet-200 group-hover:text-violet-50",
                )}
              />
              {!isCollapsed ? (
                <span className="flex flex-col">
                  <span className="font-medium text-violet-50">
                    {item.label}
                  </span>
                  <span className="text-xs text-violet-200/80">
                    {item.description}
                  </span>
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div
        className={cn(
          "mt-auto flex px-3 pb-6",
          isCollapsed ? "justify-center" : "justify-start",
        )}
      >
        <UIDropdown
          items={menuItems}
          placement="bottomRight"
          classNames={{ root: "antd-sidebar-dropdown" }}
          trigger={
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border border-violet-600/40 bg-violet-800/60 text-left transition hover:border-violet-300/70 hover:bg-violet-700/60",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-900",
                isCollapsed ? "justify-center p-2" : "p-3",
              )}
            >
              <Image
                src="https://i.pravatar.cc/60?img=32"
                alt="Avatar del usuario"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl border border-violet-600/60 object-cover"
              />
              {!isCollapsed ? (
                <span className="flex flex-1 flex-col text-left">
                  <span className="text-sm font-semibold text-white">
                    Usuario Demo
                  </span>
                  <span className="text-xs text-violet-200">
                    demo@adaptive.game
                  </span>
                </span>
              ) : null}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-violet-200 transition-transform",
                  !isCollapsed && "ml-auto",
                )}
              />
            </button>
          }
        />
      </div>
    </aside>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-violet-200 transition hover:bg-violet-800/70"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

// QuickAction se reserva para reactivar la sección "Accesos rápidos"
// comentada arriba. Evita el warning de unused-vars.
void QuickAction;
