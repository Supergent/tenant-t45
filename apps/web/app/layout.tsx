"use client";

import "./globals.css";
import { AppProviders } from "@jn79wtdqtw4r1c2vp4esmnez697shgbv/components";
import { authClient } from "@/lib/auth-client";

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders authClient={authClient}>{children}</AppProviders>
      </body>
    </html>
  );
}
