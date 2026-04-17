"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, X } from "lucide-react";

interface FullscreenToggleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function FullscreenToggle({ children, className, style }: FullscreenToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, close]);

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 md:p-12"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Vollbild schließen"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ aspectRatio: "16/9" }}
            onClick={close}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className={`relative group cursor-pointer ${className ?? ""}`} style={style} onClick={open}>
        {children}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/80 backdrop-blur-sm text-background rounded-full p-2.5 shadow-lg">
            <Maximize2 className="h-4 w-4" />
          </div>
        </div>
      </div>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
