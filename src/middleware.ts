import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "kurisari.dev";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  if (isLocal) return NextResponse.next();

  // Redirect known alt hosts to the canonical host
  if (host === `www.${CANONICAL_HOST}` || host === "cristian-aragon-salazar.vercel.app") {
    url.host = CANONICAL_HOST;
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
