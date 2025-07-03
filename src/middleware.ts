import { 
    convexAuthNextjsMiddleware, 
    createRouteMatcher,
    nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";

const isAuthPage = createRouteMatcher(["/auth"]);
 
export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
  
    // If the current requested page is not AuthPage and the user is not authenticated --> Land back on the AuthPage..
    if (!isAuthPage(request) && !convexAuth.isAuthenticated()) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }
 
    // If curr req page is AuthPage and the user is alredy Authenticated --> Redirect to the Landing Page..
    if(isAuthPage(request) && convexAuth.isAuthenticated()) {
        return nextjsMiddlewareRedirect(request, "/");
    }

    //TODO: If the user is authenticated --> Take him away from the authPage...
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};