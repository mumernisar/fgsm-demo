import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function downloadB64(b64, filename = "image.png", mime = "image/png") {
  const url = `data:${mime};base64,${b64}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
