import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// The below are list of protectected routes that only a signed in user can enter
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/account(.*)",
    "/transaction(.*)",
])
// Below are the logic to send unsigned user directly to sign in page if they try to visit proutected pages
export default clerkMiddleware(async (auth,req)=>{
    const {userId} = await auth();

    if(!userId && isProtectedRoute(req)){
        const {redirectToSignIn} = await auth();

        return redirectToSignIn()
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