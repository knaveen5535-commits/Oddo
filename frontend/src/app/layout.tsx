import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traveloop - Plan Your Next Adventure",
  description: "The ultimate travel planning and budget management platform.",
};

import AppLayout from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background min-h-screen text-foreground transition-colors duration-300`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var m=t==="light"||t==="dark"?t:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",m);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`,
          }}
        />
        <AuthProvider>
          <ThemeProvider>
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
