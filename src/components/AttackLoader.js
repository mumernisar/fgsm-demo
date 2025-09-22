"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AttackLoader({ show = false, className }) {
  if (!show) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center bg-white/70 backdrop-blur-sm",
        className
      )}
      aria-live="assertive"
      role="status"
    >
      <div className="flex items-center gap-3 rounded-full border border-violet-200 bg-white px-4 py-2 shadow-md">
        <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
        <span className="text-sm text-gray-700">Running attack…</span>
      </div>
    </div>
  );
}
