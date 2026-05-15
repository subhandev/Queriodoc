"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
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

export function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setFormError(undefined);
    setNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);

    try {
      if (pendingVerification) {
        const result = await signUp.attemptEmailAddressVerification({ code });
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/documents");
          return;
        }
        setFormError("Verification failed. Please check the code and try again.");
        return;
      }

      const parts = name.trim().split(/\s+/);
      const firstName = parts[0] ?? "";
      const lastName = parts.slice(1).join(" ");

      const createResult = await signUp.create({
        firstName,
        lastName: lastName || undefined,
        emailAddress: email,
        password,
      });

      if (createResult.status === "complete") {
        await setActive({ session: createResult.createdSessionId });
        router.push("/documents");
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Parameters<typeof getClerkErrorMessage>[0] };
      const errors = clerkErr.errors;
      setNameError(getClerkErrorMessage(errors, "first_name"));
      setEmailError(getClerkErrorMessage(errors, "email_address"));
      setPasswordError(getClerkErrorMessage(errors, "password"));
      setFormError(getClerkErrorMessage(errors));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = () => {
    if (!isLoaded || !signUp) return;
    void signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sign-up/sso-callback",
      redirectUrlComplete: "/documents",
    });
  };

  return (
    <AuthShell
      title={pendingVerification ? "Verify your email" : "Create your account"}
      subtitle={
        pendingVerification
          ? "Enter the verification code sent to your email."
          : "Start chatting with your documents in minutes."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary transition-colors hover:text-[var(--primary-hover)]"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        {formError && !nameError && !emailError && !passwordError ? (
          <p className="text-[12px] text-destructive" role="alert">
            {formError}
          </p>
        ) : null}

        {pendingVerification ? (
          <Field id="code" label="Verification code">
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              className={authInputClass()}
              required
            />
          </Field>
        ) : (
          <>
            <Field id="name" label="Full name" error={nameError}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className={authInputClass(!!nameError)}
                required
              />
            </Field>
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
                  autoComplete="new-password"
                  placeholder="Create a password"
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
            </Field>
          </>
        )}

        <button
          type="submit"
          disabled={loading || !isLoaded}
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[14px] font-medium text-primary-foreground transition-colors duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-70"
        >
          {loading ? (
            <Spinner />
          ) : pendingVerification ? (
            "Verify email"
          ) : (
            "Create account"
          )}
        </button>
      </form>

      {!pendingVerification ? (
        <>
          <Divider />
          <GoogleButton disabled={loading || !isLoaded} onClick={onGoogle} />
        </>
      ) : null}
    </AuthShell>
  );
}
