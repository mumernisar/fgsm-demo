"use client";

import { Button } from "@/components/ui/button";

export default function RunButton({
  disabled,
  onClick,
  loading,
  className,
  size,
  variant,
}) {
  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      size={size}
      variant={variant}
    >
      {loading ? "Running…" : "Run Attack"}
    </Button>
  );
}
