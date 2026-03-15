"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "et_pwa_dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wasDismissed = localStorage.getItem(DISMISS_KEY);
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-base-100 border border-base-300 rounded-2xl shadow-xl p-4 z-30 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Download className="text-primary" size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-base-content">Install app</p>
        <p className="text-sm text-base-content/70">Add to home screen for quick access and offline use.</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button type="button" className="btn btn-primary btn-sm" onClick={handleInstall}>
          Install
        </button>
        <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={handleDismiss} aria-label="Dismiss">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
