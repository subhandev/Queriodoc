import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SignUpSsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl="/documents"
      signUpForceRedirectUrl="/documents"
    />
  );
}
