import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth client for Convex integration.
 * Use this to access auth operations in queries/mutations:
 * - authComponent.getAuthUser(ctx) - Get current authenticated user
 * - authComponent.getUserById(ctx, userId) - Get user by ID
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth instance with Convex adapter.
 * This is used in HTTP routes to handle authentication requests.
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    baseURL: process.env.SITE_URL!,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Simplified for demo - enable in production
    },
    plugins: [
      convex({
        jwtExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      // Note: organization plugin not needed for simple todo app
      // Add if you need multi-tenant/team features
    ],
  });
};
