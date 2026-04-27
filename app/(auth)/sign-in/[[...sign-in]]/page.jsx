"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [state, formAction, isPending] = useActionState(signInAction, {
    error: "",
  });

  return (
    <Card className="w-full max-w-md border-emerald-900/30">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          {state?.error ? (
            <p className="text-sm text-red-500">{state.error}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-emerald-400 hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
