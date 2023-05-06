import { NextResponse } from "next/server";
import { refreshToken } from "./library/utils/queryClient";

export default async function middleware(req) {
  const token = req.cookies.get("token");
  const emailVerified = req.cookies.get("isVerified");

  let isVerified = token ?? false;

  const publicUrls = ["/", "", "/home", "/about", "/contact", '/sitemap.xml'];

  const restrictUnverifiedUserAccessFromPages = ["result", "template"];

  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/favicon.ico") ||
    req.nextUrl.pathname.startsWith("/assets") ||
    req.nextUrl.pathname.startsWith("/verification")
  ) {
    return NextResponse.next();
  } else if (req.nextUrl.pathname.startsWith("/auth")) {
    if (isVerified) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
    }
  } else {
    if (
      isVerified &&
      emailVerified === "false" &&
      (req.nextUrl.pathname.startsWith("/companynumber") ||
        req.nextUrl.pathname.startsWith("/search") ||
        req.nextUrl.pathname.startsWith("/stepperpages") ||
        restrictUnverifiedUserAccessFromPages.includes(req.nextUrl.pathname))
    ) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/email-verify`
      );
    } else if (!isVerified && publicUrls.includes(req.nextUrl.pathname)) {
      const response = NextResponse.next();
      response.headers.set("X-ISVERFIED", "0");
      return response;
    } else if (!isVerified) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`
      );
    }
  }
}
