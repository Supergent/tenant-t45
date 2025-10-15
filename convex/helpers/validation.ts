/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validates todo title
 * Must be non-empty and under 200 characters
 */
export function isValidTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validates todo description
 * Must be under 2000 characters if provided
 */
export function isValidDescription(description?: string): boolean {
  if (!description) return true;
  return description.length <= 2000;
}

/**
 * Validates due date
 * Must be a future timestamp if provided
 */
export function isValidDueDate(dueDate?: number): boolean {
  if (!dueDate) return true;
  return dueDate > Date.now();
}

/**
 * Validates todo status
 */
export function isValidStatus(status: string): status is "active" | "completed" | "archived" {
  return ["active", "completed", "archived"].includes(status);
}

/**
 * Validates priority level
 */
export function isValidPriority(priority: string): priority is "low" | "medium" | "high" {
  return ["low", "medium", "high"].includes(priority);
}

/**
 * Validates all todo fields for creation
 */
export function validateTodoCreate(args: {
  title: string;
  description?: string;
  dueDate?: number;
  priority: string;
}): { valid: boolean; error?: string } {
  if (!isValidTitle(args.title)) {
    return { valid: false, error: "Title must be between 1 and 200 characters" };
  }

  if (!isValidDescription(args.description)) {
    return { valid: false, error: "Description must be under 2000 characters" };
  }

  if (!isValidDueDate(args.dueDate)) {
    return { valid: false, error: "Due date must be in the future" };
  }

  if (!isValidPriority(args.priority)) {
    return { valid: false, error: "Priority must be low, medium, or high" };
  }

  return { valid: true };
}

/**
 * Validates todo fields for update
 */
export function validateTodoUpdate(args: {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: number;
  priority?: string;
}): { valid: boolean; error?: string } {
  if (args.title !== undefined && !isValidTitle(args.title)) {
    return { valid: false, error: "Title must be between 1 and 200 characters" };
  }

  if (args.description !== undefined && !isValidDescription(args.description)) {
    return { valid: false, error: "Description must be under 2000 characters" };
  }

  if (args.status !== undefined && !isValidStatus(args.status)) {
    return { valid: false, error: "Status must be active, completed, or archived" };
  }

  if (args.dueDate !== undefined && !isValidDueDate(args.dueDate)) {
    return { valid: false, error: "Due date must be in the future" };
  }

  if (args.priority !== undefined && !isValidPriority(args.priority)) {
    return { valid: false, error: "Priority must be low, medium, or high" };
  }

  return { valid: true };
}
