/**
 * Application Constants
 */

// Pagination
export const DEFAULT_PAGE_LIMIT = 50;
export const MAX_PAGE_LIMIT = 100;

// Todo limits
export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;

// Status types
export const TODO_STATUSES = ["active", "completed", "archived"] as const;
export type TodoStatus = typeof TODO_STATUSES[number];

// Priority types
export const TODO_PRIORITIES = ["low", "medium", "high"] as const;
export type TodoPriority = typeof TODO_PRIORITIES[number];

// Valid status transitions
export const STATUS_TRANSITIONS: Record<TodoStatus, TodoStatus[]> = {
  active: ["completed", "archived"],
  completed: ["active", "archived"],
  archived: ["active"],
};

/**
 * Checks if a status transition is valid
 */
export function isValidStatusTransition(from: TodoStatus, to: TodoStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
