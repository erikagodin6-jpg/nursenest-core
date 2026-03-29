"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function safeCallbackPath(raw: string | null): string | null {
  if (!raw?.trim()) return null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const u = new URL(raw, origin);
    if (u.origin !== new URL(origin).origin) return null;
    if (!u.pathname.startsWith("/")) return null;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}

export function LoginForm({
  forgotPasswordHref = "/forgot-password",
  forgotPasswordLabel = "Forgot password?",
}: {
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fromQuery = safeCallbackPath(searchParams.get("callbackUrl"));
    const redirectTarget = fromQuery ?? "/app";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: redirectTarget,
    });

    if (result?.error) {
      setError("Invalid email, username, or password.");
      return;
    }
    if (result && result.ok === false) {
      setError("Unable to sign in. Try again.");
      return;
    }

    router.refresh();
    router.push(redirectTarget);
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="login-identifier" className="text-sm font-medium text-foreground">
          Email or username
        </label>
        <input
          id="login-identifier"
          className="w-full rounded-xl border border-border bg-white px-3 py-2"
          type="text"
          name="email"
          placeholder="Enter your email or username"
          required
          autoComplete="username"
        />
      </div>
      <div className="space-y-1.5">
        <input className="w-full rounded-xl border border-border bg-white px-3 py-2" type="password" name="password" placeholder="Password" required />
        <div className="flex justify-end sm:justify-start">
          <Link
            href={forgotPasswordHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            {forgotPasswordLabel}
          </Link>
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded-xl bg-primary px-4 py-2 font-semibold" type="submit">
        Sign in
      </button>
    </form>
  );
}
