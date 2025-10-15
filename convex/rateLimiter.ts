/**
 * Rate Limiter Configuration
 *
 * Defines rate limits for all API operations to prevent abuse.
 */

import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Todo operations - token bucket allows bursts
  createTodo: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
  updateTodo: { kind: "token bucket", rate: 30, period: MINUTE },
  deleteTodo: { kind: "token bucket", rate: 20, period: MINUTE },

  // Batch operations - more restrictive
  bulkUpdate: { kind: "token bucket", rate: 5, period: MINUTE },

  // Read operations - more generous limits
  listTodos: { kind: "token bucket", rate: 100, period: MINUTE },
});
