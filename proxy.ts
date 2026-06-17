import { NextResponse, type NextRequest } from "next/server";

import { AFTER_LOGIN_PATH, LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth-config";

// Runtime edge : on se contente de vérifier la PRÉSENCE du cookie de session.
// Le déchiffrement / refresh se fait côté Node (route handlers, server actions).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  // Routes d'auth toujours accessibles (initiation + callback OAuth).
  if (pathname.startsWith("/api/auth") || pathname === "/auth/callback") {
    return NextResponse.next();
  }

  // Page de login : un utilisateur déjà connecté est renvoyé au dashboard.
  if (pathname === LOGIN_PATH) {
    if (hasSession) {
      return NextResponse.redirect(new URL(AFTER_LOGIN_PATH, request.url));
    }
    return NextResponse.next();
  }

  // Tout le reste est protégé.
  if (!hasSession) {
    const url = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclut les assets statiques, images, polices et fichiers PWA.
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
  ],
};
