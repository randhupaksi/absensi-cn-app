"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft, Menu, Search, SlidersHorizontal } from "lucide-react";

type DashboardTopbarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  adminName: string;
  onBack: () => void;
  onToggleSidebar: () => void;
};

export function DashboardTopbar({
  searchTerm,
  onSearchChange,
  adminName,
  onBack,
  onToggleSidebar,
}: DashboardTopbarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="rounded-[30px] border border-white/70 bg-white/75 p-4 shadow-[0_20px_55px_rgba(153,161,179,0.12)] backdrop-blur-xl"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="hidden size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 sm:flex"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200/70 bg-slate-50/90 px-4 text-sm text-slate-500 sm:min-w-[360px]">
            <Search className="size-4 shrink-0 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari siswa, NIS, guru, atau username..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-800"
          >
            <SlidersHorizontal className="size-4" />
          </button>
          <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white px-3 py-2 shadow-[0_12px_24px_rgba(148,163,184,0.12)]">
            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-50">
              <Image
                src="/images/logos/logo_cn_downscale.png"
                alt="Avatar Admin"
                width={34}
                height={34}
                className="rounded-full"
              />
            </div>
            <div className="min-w-0 pr-2">
              <p className="truncate text-sm font-semibold text-slate-900">
                {adminName}
              </p>
              <p className="text-sm text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
