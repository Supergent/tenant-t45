/**
 * Database Layer: Todos
 *
 * This is the ONLY file that directly accesses the todos table using ctx.db.
 * All todos-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE
export async function createTodo(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    status: "active" | "completed" | "archived";
    dueDate?: number;
    priority: "low" | "medium" | "high";
  }
) {
  const now = Date.now();
  return await ctx.db.insert("todos", {
    ...args,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getTodoById(
  ctx: QueryCtx,
  id: Id<"todos">
) {
  return await ctx.db.get(id);
}

// READ - Get all todos by user
export async function getTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get todos by user and status
export async function getTodosByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: "active" | "completed" | "archived"
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

// READ - Get todos by user and priority
export async function getTodosByUserAndPriority(
  ctx: QueryCtx,
  userId: string,
  priority: "low" | "medium" | "high"
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_priority", (q) =>
      q.eq("userId", userId).eq("priority", priority)
    )
    .order("desc")
    .collect();
}

// READ - Get active todos by user (most common query)
export async function getActiveTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_status_and_created", (q) =>
      q.eq("userId", userId).eq("status", "active")
    )
    .order("desc")
    .collect();
}

// UPDATE
export async function updateTodo(
  ctx: MutationCtx,
  id: Id<"todos">,
  args: {
    title?: string;
    description?: string;
    status?: "active" | "completed" | "archived";
    dueDate?: number;
    priority?: "low" | "medium" | "high";
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteTodo(
  ctx: MutationCtx,
  id: Id<"todos">
) {
  return await ctx.db.delete(id);
}

// UTILITY - Count todos by user
export async function countTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  const todos = await getTodosByUser(ctx, userId);
  return todos.length;
}

// UTILITY - Count active todos by user
export async function countActiveTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  const todos = await getActiveTodosByUser(ctx, userId);
  return todos.length;
}
