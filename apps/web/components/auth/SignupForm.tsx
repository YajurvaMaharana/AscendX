"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { registerUser, isEmailRegistered } from "@/lib/userDatabase";
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

const signupSchema = z
  .object({
    name: z.string().min(1, { message: "Full Name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, syncUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    const cleanEmail = data.email.trim().toLowerCase();

    // 1. Email Existence Check & Uniqueness Validation
    if (isEmailRegistered(cleanEmail)) {
      setServerError("An account with this email already exists. Please sign in instead.");
      setIsLoading(false);
      return;
    }

    // 2. Register user into verified database array
    const result = registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!result.success || !result.user) {
      setServerError(result.error || "Registration failed. Please try again.");
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
      setSuccessMessage("Account created & verified! Redirecting to setup...");
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 400);
    } catch (err: any) {
      setServerError("Account created, but error during session sync.");
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
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Register credentials into the verified user database
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
              {serverError}
              {serverError.includes("already exists") && (
                <div className="mt-2">
                  <Link
                    href="/login"
                    className="text-xs underline font-bold hover:text-foreground"
                  >
                    Click here to Sign In instead
                  </Link>
                </div>
              )}
            </div>
          )}
          {successMessage && (
            <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-600 dark:text-emerald-400">
              {successMessage}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
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
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
            {isLoading ? "Creating account…" : "Create account"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
