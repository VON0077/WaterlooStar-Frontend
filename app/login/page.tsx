"use client";

import { useState, type FormEvent } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

import { title } from "@/components/primitives";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const session = await login({ email, password, remember });
      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("auth_token", session.token);
      setFeedback({
        type: "success",
        message: `Welcome back, ${session.user.username}!`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to sign in right now",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex w-full justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2">
          <h1 className={title({ size: "sm" })}>Login</h1>
          <p className="text-sm text-default-500">
            Sign in to continue to Waterloo Star.
          </p>
          <p className="text-xs text-default-400">
            Demo: demo@waterloo.star / password123
          </p>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              name="email"
              value={email}
              onValueChange={setEmail}
              placeholder="you@example.com"
              type="email"
              variant="bordered"
            />
            <Input
              isRequired
              label="Password"
              labelPlacement="outside"
              name="password"
              value={password}
              onValueChange={setPassword}
              placeholder="••••••••"
              type="password"
              variant="bordered"
            />
            <div className="flex items-center justify-between">
              <Switch
                name="remember"
                size="sm"
                isSelected={remember}
                onValueChange={setRemember}
              >
                Remember me
              </Switch>
              <Link href="/forgot-password" size="sm">
                Forgot password?
              </Link>
            </div>
            {feedback ? (
              <div
                className={`rounded-md border px-3 py-2 text-sm ${
                  feedback.type === "error"
                    ? "border-red-200 text-red-600"
                    : "border-green-200 text-green-600"
                }`}
              >
                {feedback.message}
              </div>
            ) : null}
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </CardBody>
        <CardFooter className="flex justify-center text-sm text-default-500">
          <span>Don&apos;t have an account?</span>
          <Link className="ml-1" href="/register" size="sm">
            Create one
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
