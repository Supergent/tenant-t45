"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useToast,
  StyledTabsList,
  StyledTabsTrigger,
  StyledTabsContent,
  Tabs,
} from "@jn79wtdqtw4r1c2vp4esmnez697shgbv/components";

type Priority = "low" | "medium" | "high";
type Status = "active" | "completed" | "archived";

interface TodoFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export function TodoList() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<TodoFormData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  // Queries
  const todos = useQuery(api.endpoints.todos.list);
  const stats = useQuery(api.endpoints.todos.stats);

  // Mutations
  const createTodo = useMutation(api.endpoints.todos.create);
  const updateTodo = useMutation(api.endpoints.todos.update);
  const deleteTodo = useMutation(api.endpoints.todos.remove);
  const completeTodo = useMutation(api.endpoints.todos.complete);

  const loading = todos === undefined || stats === undefined;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTodo({
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      });

      toast({
        title: "Todo created",
        description: "Your todo has been created successfully.",
      });

      setFormData({ title: "", description: "", priority: "medium", dueDate: "" });
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create todo",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (id: Id<"todos">) => {
    try {
      await completeTodo({ id });
      toast({
        title: "Todo completed",
        description: "Great job! 🎉",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: Id<"todos">) => {
    try {
      await deleteTodo({ id });
      toast({
        title: "Todo deleted",
        description: "Your todo has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-danger text-danger-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "archived":
        return "bg-muted text-neutral-foreground-secondary";
    }
  };

  const activeTodos = todos?.filter((t) => t.status === "active") ?? [];
  const completedTodos = todos?.filter((t) => t.status === "completed") ?? [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{stats.total}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-primary">{stats.active}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-success">{stats.completed}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-danger">{stats.byPriority.high}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Todo List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Todos</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>Create Todo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Todo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter todo title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as Priority })
                    }
                    className="w-full rounded-md border border-border bg-surface px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="active">
            <StyledTabsList>
              <StyledTabsTrigger value="active">
                Active ({activeTodos.length})
              </StyledTabsTrigger>
              <StyledTabsTrigger value="completed">
                Completed ({completedTodos.length})
              </StyledTabsTrigger>
            </StyledTabsList>

            <StyledTabsContent value="active">
              {loading ? (
                <Skeleton className="h-32 w-full" />
              ) : activeTodos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-foreground-secondary">
                    No active todos. Create one to get started!
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTodos.map((todo) => (
                      <TableRow key={todo._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{todo.title}</p>
                            {todo.description && (
                              <p className="text-sm text-neutral-foreground-secondary">
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(todo.priority)}>
                            {todo.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {todo.dueDate
                            ? new Date(todo.dueDate).toLocaleDateString()
                            : "No due date"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleComplete(todo._id)}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(todo._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </StyledTabsContent>

            <StyledTabsContent value="completed">
              {loading ? (
                <Skeleton className="h-32 w-full" />
              ) : completedTodos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-foreground-secondary">
                    No completed todos yet. Complete one to see it here!
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTodos.map((todo) => (
                      <TableRow key={todo._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium line-through">{todo.title}</p>
                            {todo.description && (
                              <p className="text-sm text-neutral-foreground-secondary">
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(todo.priority)}>
                            {todo.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(todo.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(todo._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </StyledTabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
