import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SignInSsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl="/documents"
      signUpForceRedirectUrl="/documents"
    />
  );
}
