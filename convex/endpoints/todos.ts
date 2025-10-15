/**
 * Endpoint Layer: Todos
 *
 * Business logic for todo management.
 * Composes database operations from the db layer.
 * Handles authentication, authorization, and rate limiting.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { Todos } from "../db";
import { rateLimiter } from "../rateLimiter";
import { validateTodoCreate, validateTodoUpdate } from "../helpers/validation";

/**
 * Create a new todo
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting - use _id for the key
    const rateLimitStatus = await rateLimiter.limit(ctx, "createTodo", {
      key: authUser._id,
    });

    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitStatus.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Validation
    const validation = validateTodoCreate(args);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 4. Create todo (NEVER use ctx.db directly!)
    return await Todos.createTodo(ctx, {
      userId: authUser._id,
      title: args.title,
      description: args.description,
      status: "active", // New todos start as active
      dueDate: args.dueDate,
      priority: args.priority,
    });
  },
});

/**
 * List all todos for the authenticated user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUser(ctx, authUser._id);
  },
});

/**
 * List todos filtered by status
 */
export const listByStatus = query({
  args: {
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUserAndStatus(ctx, authUser._id, args.status);
  },
});

/**
 * List todos filtered by priority
 */
export const listByPriority = query({
  args: {
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUserAndPriority(ctx, authUser._id, args.priority);
  },
});

/**
 * Get a single todo by ID
 */
export const get = query({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    // Verify ownership
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to view this todo");
    }

    return todo;
  },
});

/**
 * Update a todo
 */
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("active"), v.literal("completed"), v.literal("archived"))
    ),
    dueDate: v.optional(v.number()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });

    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitStatus.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // 4. Validation
    const { id, ...updateArgs } = args;
    const validation = validateTodoUpdate(updateArgs);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 5. Update todo
    return await Todos.updateTodo(ctx, id, updateArgs);
  },
});

/**
 * Delete a todo
 */
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "deleteTodo", {
      key: authUser._id,
    });

    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitStatus.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to delete this todo");
    }

    // 4. Delete todo
    return await Todos.deleteTodo(ctx, args.id);
  },
});

/**
 * Mark todo as completed
 */
export const complete = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    return await Todos.updateTodo(ctx, args.id, { status: "completed" });
  },
});

/**
 * Archive a todo
 */
export const archive = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    return await Todos.updateTodo(ctx, args.id, { status: "archived" });
  },
});

/**
 * Get todo statistics for the user
 */
export const stats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const allTodos = await Todos.getTodosByUser(ctx, authUser._id);

    const stats = {
      total: allTodos.length,
      active: allTodos.filter((t) => t.status === "active").length,
      completed: allTodos.filter((t) => t.status === "completed").length,
      archived: allTodos.filter((t) => t.status === "archived").length,
      byPriority: {
        high: allTodos.filter((t) => t.priority === "high" && t.status === "active").length,
        medium: allTodos.filter((t) => t.priority === "medium" && t.status === "active").length,
        low: allTodos.filter((t) => t.priority === "low" && t.status === "active").length,
      },
    };

    return stats;
  },
});
