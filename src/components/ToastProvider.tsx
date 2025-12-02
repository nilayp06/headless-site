"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastContextType = { show: (msg: string) => void };
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<string[]>([]);

  const show = (msg: string) => {
    setQueue((q) => [...q, msg]);
    setTimeout(() => {
      setQueue((q) => q.slice(1));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 60 }}>
        <AnimatePresence>
          {queue.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                background: "#111827",
                color: "white",
                padding: "10px 14px",
                borderRadius: 8,
                marginBottom: 8,
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              }}
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
