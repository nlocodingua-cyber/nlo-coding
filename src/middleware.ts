import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Legacy /ua/ → /uk/ redirect
  if (pathname.startsWith("/ua")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ua/, "/uk");
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
