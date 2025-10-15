import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

const http = httpRouter();

/**
 * Better Auth HTTP routes
 * Handles all authentication requests (login, signup, logout, session management)
 *
 * Routes:
 * - POST /auth/sign-in/email - Email/password login
 * - POST /auth/sign-up/email - Email/password signup
 * - POST /auth/sign-out - Logout
 * - GET /auth/session - Get current session
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
