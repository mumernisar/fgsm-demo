"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImagePreview({ src, alt, aspect = "4/3" }) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <div
        className={cn(
          "rounded-lg bg-gray-100",
          aspect === "square" ? "aspect-square" : "aspect-[4/3]"
        )}
        aria-label="No image selected"
      />
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative w-full cursor-pointer"
        aria-label="Open full screen preview"
      >
        <div
          className={cn(
            "rounded-lg shadow-2xl overflow-hidden bg-gray-100",
            aspect === "square" ? "aspect-square" : "aspect-[4/3]"
          )}
        >
          <Image
            src={src}
            alt={alt || ""}
            width={1200}
            height={900}
            className="w-full h-full object-contain transition duration-200 group-hover:blur-[2px]"
            priority={false}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="bg-black/50 text-white rounded-full p-2">
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl w-[95vw] p-4 sm:p-6 bg-white">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          <div className="relative w-full h-[70dvh]">
            <Image
              src={src}
              alt={alt || ""}
              width={1600}
              height={1200}
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
