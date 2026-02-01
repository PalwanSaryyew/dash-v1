// middleware.ts (projenizin kök dizininde, app klasörü ile aynı seviyede)

export { default } from "next-auth/middleware";

export const config = {
   matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
