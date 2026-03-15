"use client";

import { useEffect } from "react";

const STORAGE_KEY = "et_theme";

export function getStoredTheme(): string {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(STORAGE_KEY) || "light";
}

export function setStoredTheme(theme: string): void {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export default function ThemeInit() {
  useEffect(() => {
    const theme = getStoredTheme();
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  return null;
}
