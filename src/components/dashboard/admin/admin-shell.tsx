"use client";

import {
  clearAuthSession,
  getAuthSession,
  getDashboardPathForRole,
  mapApiRoleToDashboardRole,
} from "@/lib/auth";
import type { AuthSession } from "@/types/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  adminSidebarItems,
  DashboardSidebar,
} from "@/components/dashboard/admin/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/admin/dashboard-topbar";

type AdminShellProps = {
  children: (session: AuthSession) => ReactNode;
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export function AdminShell({
  children,
  searchTerm,
  onSearchChange,
}: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const session = getAuthSession();
  const isAdminSession =
    session && mapApiRoleToDashboardRole(session.user.role) === "admin";

  useEffect(() => {
    if (!session) {
      router.replace("/login");
      return;
    }

    if (!isAdminSession) {
      router.replace(getDashboardPathForRole(session.user.role));
    }
  }, [isAdminSession, router, session]);

  if (!session || !isAdminSession) {
    return null;
  }

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/");
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(126,182,155,0.22),transparent_26%),radial-gradient(circle_at_top_right,rgba(111,166,208,0.12),transparent_18%),linear-gradient(180deg,#f7f5ee_0%,#f2f0e8_100%)] text-slate-800">
      <div className="min-h-screen lg:pl-[272px]">
        <DashboardSidebar
          items={adminSidebarItems}
          activePath={pathname}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <main className="min-w-0 space-y-5 p-4 md:p-5">
          <DashboardTopbar
            adminName={session.user.name}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onBack={handleBack}
            onToggleSidebar={() => setMobileSidebarOpen(true)}
          />

          {children(session)}
        </main>
      </div>
    </div>
  );
}
