"use client";

import { useState } from "react";
import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  useToast,
  Tabs,
  StyledTabsList,
  StyledTabsTrigger,
  StyledTabsContent,
} from "@jn79wtdqtw4r1c2vp4esmnez697shgbv/components";

export function AuthForm() {
  const { data: session, isPending } = useSession();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn.email({ email, password });
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp.email({ email, password, name });
      toast({
        title: "Account created",
        description: "Welcome! You're now signed in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign up",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-neutral-foreground-secondary">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-neutral-foreground-secondary">Signed in as:</p>
            <p className="font-medium">{session.user?.email}</p>
            {session.user?.name && (
              <p className="text-sm text-neutral-foreground-secondary">{session.user.name}</p>
            )}
          </div>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin">
          <StyledTabsList className="w-full">
            <StyledTabsTrigger value="signin" className="flex-1">
              Sign In
            </StyledTabsTrigger>
            <StyledTabsTrigger value="signup" className="flex-1">
              Sign Up
            </StyledTabsTrigger>
          </StyledTabsList>

          <StyledTabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </StyledTabsContent>

          <StyledTabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </StyledTabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
