"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PremiumModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
};

export function PremiumModal({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
  className,
}: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "ui-modal-shell !fixed !left-1/2 !top-1/2 !flex !w-[min(100%,980px)] !max-h-[calc(100dvh-1.5rem)] !max-w-[calc(100vw-1rem)] !-translate-x-1/2 !-translate-y-1/2 !gap-0 !overflow-hidden border-none bg-transparent p-0 text-slate-900 ring-0 sm:!max-h-[calc(100dvh-3rem)] sm:!max-w-[880px]",
          className,
        )}
      >
        <div className="ui-modal-header">
          <div className="flex min-w-0 items-start gap-4">
            <span className="ui-modal-header-icon shrink-0">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-[1.75rem] font-semibold tracking-[-0.04em] text-slate-900">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-[36rem] text-sm leading-6 text-slate-500">
                {description}
              </DialogDescription>
            </div>
          </div>

          <button
            type="button"
            aria-label="Tutup modal"
            onClick={() => onOpenChange(false)}
            className="ui-modal-close shrink-0"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div className="ui-modal-body">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
