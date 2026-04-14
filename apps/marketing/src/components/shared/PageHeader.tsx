"use client";
import { motion } from "motion/react";

interface PageHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
}

export function PageHeader({ badge, title, highlight, subtitle, center = true }: PageHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${center ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}
        >
          <div className="h-[2px] w-8 bg-foreground" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">{badge}</span>
          {center && <div className="h-[2px] w-8 bg-foreground" />}
        </motion.div>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
      >
        {title}
        {highlight && <> {highlight}</>}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
