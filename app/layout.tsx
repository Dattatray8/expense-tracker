import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProvider from "./ClientProvider";
import ThemeInit from "@/components/ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Expense Tracker | Track Income & Spending",
  description: "Track daily expenses and income, categorize spending, view monthly summaries and spending trends. Take control of your finances.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "ExpenseTracker" },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <ThemeInit />
        <ClientProvider>{children}</ClientProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
