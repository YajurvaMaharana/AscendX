"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { verifyCredentials } from "@/lib/userDatabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, syncUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (authUser && !authLoading && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace("/dashboard");
    }
  }, [authUser, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setServerError(null);

    // Strict Database Verification Check
    const result = verifyCredentials(data.email, data.password);

    if (!result.success || !result.user) {
      setServerError(
        result.error || "Invalid credentials or account does not exist. Please check your details or create a new account."
      );
      setIsLoading(false);
      return;
    }

    try {
      const userPayload = {
        id: result.user.id,
        email: result.user.email,
        user_metadata: {
          display_name: result.user.name,
          full_name: result.user.name,
          target_role: result.user.target_role,
        },
      };

      await syncUser(userPayload, "mock-database-token", result.user.name);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setServerError("An error occurred during authentication. Please try again.");
      setIsLoading(false);
    }
  }

  if (authUser && !authLoading) {
    return (
      <Card className="w-full max-w-md text-center p-6 space-y-4">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-xl font-bold">You are signed in</CardTitle>
          <CardDescription>
            Signed in as <strong className="text-foreground">{authUser.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Redirecting to your dashboard...
          </p>
          <Button asChild className="w-full font-semibold">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to sign in to your verified account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {serverError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Sign in"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
