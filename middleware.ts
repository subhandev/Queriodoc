import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isApiRoute(req)) {
    return;
  }

  const { userId } = auth();

  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/documents", req.url));
  }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
