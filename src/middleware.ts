// middleware.ts (projenizin kök dizininde, app klasörü ile aynı seviyede)

export { default } from "next-auth/middleware";

export const config = {
  // login sayfasını hariç tutarak diğer tüm sayfaları koru
  matcher: ["/", "/topups", "/orders"],
};