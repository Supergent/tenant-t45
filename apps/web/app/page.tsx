"use client";

import { useSession } from "@/lib/auth-client";
import { TodoList } from "@/components/todo-list";
import { AuthForm } from "@/components/auth-form";
import { Card, CardHeader, CardTitle, CardContent } from "@jn79wtdqtw4r1c2vp4esmnez697shgbv/components";

export default function Page() {
  const { data: session, isPending } = useSession();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Simple Todo App</CardTitle>
          <p className="text-neutral-foreground-secondary">
            A minimalist todo list with real-time sync powered by Convex
          </p>
        </CardHeader>
      </Card>

      {/* Auth / Todo Content */}
      {isPending ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-neutral-foreground-secondary">Loading...</p>
          </CardContent>
        </Card>
      ) : session ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Welcome, {session.user?.name || "User"}!</h2>
              <p className="text-sm text-neutral-foreground-secondary">{session.user?.email}</p>
            </div>
          </div>
          <TodoList />
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <AuthForm />
          <Card className="mt-6">
            <CardContent className="py-4">
              <p className="text-sm text-center text-neutral-foreground-secondary">
                Sign in or create an account to start managing your todos
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
