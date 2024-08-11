import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

// export default clerkMiddleware();
export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  if (auth().userId && isPublicRoute(request)) {
    let path = auth().orgId ? `/organization/${auth().orgId}` : '/select-org';

    const orgSelection = new URL(path, request.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!auth().userId && !isPublicRoute(request)) {
    auth().redirectToSignIn({
      returnBackUrl: request.url,
    })
  }

  if (auth().userId && !auth().orgId && request.nextUrl.pathname !== '/select-org') {
    const orgSelection = new URL('/select-org', request.url);
    return NextResponse.redirect(orgSelection);
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
