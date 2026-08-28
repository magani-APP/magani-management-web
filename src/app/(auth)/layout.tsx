"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import "@/styles/auth.css";

// Slide direction: going to /register slides in from the right,
// going back to /login slides in from the left.
const variants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
  }),
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const direction = pathname?.startsWith("/register") ? 1 : -1;

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
