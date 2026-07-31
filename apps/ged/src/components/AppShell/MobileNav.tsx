"use client";

// Libs
import { AnimatePresence, motion } from "framer-motion";

// Components
import Sidebar from "./Sidebar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-0 top-0 h-full"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
          >
            <Sidebar />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
