"use client";

import React from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  return (
    <div className="bg-warning/90 text-warning-content px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-md sticky top-0 z-20">
      <WifiOff size={18} />
      <span>You&apos;re offline. Viewing cached data. New entries will sync when you&apos;re back online.</span>
    </div>
  );
}
