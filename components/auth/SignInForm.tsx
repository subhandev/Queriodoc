"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  AuthShell,
  Field,
  authInputClass,
  Divider,
  GoogleButton,
  Spinner,
} from "@/components/auth/AuthShell";
import { getClerkErrorMessage } from "@/lib/clerk-errors";

export function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setFormError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/documents");
        return;
      }

      setFormError("Additional verification is required. Please try again.");
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Parameters<typeof getClerkErrorMessage>[0] };
      const errors = clerkErr.errors;
      setEmailError(getClerkErrorMessage(errors, "identifier"));
      setPasswordError(getClerkErrorMessage(errors, "password"));
      setFormError(getClerkErrorMessage(errors));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = () => {
    if (!isLoaded || !signIn) return;
    void signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sign-in/sso-callback",
      redirectUrlComplete: "/documents",
    });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Welcome back. Your documents are waiting."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary transition-colors hover:text-[var(--primary-hover)]"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        {formError && !emailError && !passwordError ? (
          <p className="text-[12px] text-destructive" role="alert">
            {formError}
          </p>
        ) : null}
        <Field id="email" label="Email address" error={emailError}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={authInputClass(!!emailError)}
            required
          />
        </Field>
        <Field id="password" label="Password" error={passwordError}>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={`${authInputClass(!!passwordError)} pr-11`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex justify-end pt-1">
            <span className="text-[12px] text-muted-foreground">
              Forgot password? Contact support.
            </span>
          </div>
        </Field>

        <button
          type="submit"
          disabled={loading || !isLoaded}
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[14px] font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-70"
        >
          {loading ? <Spinner /> : "Sign in"}
        </button>
      </form>

      <Divider />
      <GoogleButton disabled={loading || !isLoaded} onClick={onGoogle} />
    </AuthShell>
  );
}
