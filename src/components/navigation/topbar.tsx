"use client";

import Link from "next/link";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-4 z-20 rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="rounded-2xl" />
              }
            >
              <span className="sr-only">Buka menu</span>
                <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 grid gap-2">
                {dashboardNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      render={<Link href={item.href} />}
                      variant={item.active ? "default" : "ghost"}
                      className="justify-start rounded-2xl"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Cari siswa, kelas, atau data absensi..."
            className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-2xl">
            <Bell className="size-4" />
          </Button>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <Avatar className="size-10">
              <AvatarFallback className="bg-sky-100 text-sky-800">
                CN
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Admin Sekolah</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
