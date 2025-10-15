"use client";

import * as React from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "@convex-dev/better-auth/react";
import { ToastProvider } from "./toast";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

interface AppProvidersProps {
  children: React.ReactNode;
  authClient: any; // Better Auth client from consuming app
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, authClient }) => {
  return (
    <ConvexProviderWithAuth client={convex} authClient={authClient}>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </ConvexProviderWithAuth>
  );
};
