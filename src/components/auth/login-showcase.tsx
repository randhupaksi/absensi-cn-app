"use client";

import { Badge } from "@/components/ui/badge";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Leaf, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";

export function LoginShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22 });
  const glowTransform = useMotionTemplate`translate(${smoothX}px, ${smoothY}px)`;
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <section
      className="relative hidden min-h-[560px] lg:flex lg:items-center"
      onMouseMove={(event) => {
        if (prefersReducedMotion) {
          return;
        }

        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const clientX = event.clientX;
        const clientY = event.clientY;

        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = requestAnimationFrame(() => {
          const x = ((clientX - left) / width - 0.5) * 18;
          const y = ((clientY - top) / height - 0.5) * 18;
          mouseX.set(x);
          mouseY.set(y);
        });
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { transform: glowTransform }}
        className="pointer-events-none absolute left-[8%] top-[24%] h-44 w-44 transform-gpu rounded-full bg-emerald-200/24 blur-[82px] will-change-transform"
      />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 max-w-xl space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
            transition={prefersReducedMotion ? undefined : { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-fit"
          >
            <Badge className="w-fit rounded-full border border-emerald-200/70 bg-white/60 px-4 py-1 text-emerald-800 shadow-sm hover:bg-white/60">
              <Leaf className="size-4" />
              Sistem Sekolah Terintegrasi
            </Badge>
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.12 }}
            className="max-w-lg font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-slate-950 xl:text-6xl"
          >
            Akses absensi modern untuk SMK Citra Negara.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.2 }}
            className="max-w-md text-base leading-8 text-slate-600"
          >
            Pengalaman masuk yang elegan, terarah, dan dirancang untuk lingkungan sekolah yang profesional.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex items-center gap-3 text-sm text-slate-500"
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
            transition={prefersReducedMotion ? undefined : { duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="rounded-full border border-white/65 bg-white/55 p-2.5 shadow-sm backdrop-blur"
          >
            <ShieldCheck className="size-4 text-emerald-700" />
          </motion.div>
          <p>Portal login dengan validasi peran yang terjaga.</p>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-[14%] h-64 w-64 rounded-full bg-emerald-300/22 blur-3xl" />
        <div className="absolute bottom-[12%] left-[18%] h-72 w-72 rounded-full bg-lime-200/16 blur-3xl" />
        <div className="absolute right-[14%] top-[28%] h-32 w-32 rounded-full border border-white/40 bg-white/20 shadow-[0_20px_60px_rgba(22,85,58,0.08)] backdrop-blur-2xl" />
        <div className="absolute bottom-[18%] left-[2%] h-px w-56 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      </div>
    </section>
  );
}
