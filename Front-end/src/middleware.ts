import { NextRequest, NextResponse } from "next/server";
import { getAuthData } from "./api/services/AuthService";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.png|.jpg|next.svg).*)",
  ],
};

const protectPathRegex = [/^\/management(\/.*)?$/];
const memberPathRegex = [/^\/jp\/member(\/.*)?$/, /^\/jp\/cart(\/.*)?$/];
const managementLoginPath = "/management/auth/login";
const clientLoginPath = "/auth/login";

type UserAuth = {
  userId: number;
  role: string;
};
type AuthResponse =
  | { userAuthData: UserAuth; status: number } // Trường hợp thành công
  | { error: string }; // Trường hợp có lỗi
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === managementLoginPath;
  const isClientLoginPath = pathname === clientLoginPath;
  const isProtectPath = protectPathRegex.some((regex) => regex.test(pathname));
  const isMemberPath = memberPathRegex.some((regex) => regex.test(pathname));

  function isUserAuthData(
    response: AuthResponse,
  ): response is { userAuthData: UserAuth; status: number } {
    return (response as any).userAuthData !== undefined;
  }
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/jp/client/men", request.url));
  }
  if ((isProtectPath || isMemberPath) && !isLoginPath && !isClientLoginPath) {
    // Chỉ xác thực token nếu đang truy cập đường dẫn được bảo vệ và không phải đường dẫn đăng nhập
    const response: AuthResponse = await getAuthData();
    if (isUserAuthData(response)) {
      const { userAuthData, status } = response;
      if (userAuthData != null) {
        if (status === 200) {
          const response = NextResponse.next();
          response.cookies.set("authenticated", "true", {
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
          if (userAuthData.role !== "ADMIN" && isProtectPath) {
            return NextResponse.redirect(new URL("/not-found", request.url));
          }
          return response;
        } else {
          const response = NextResponse.next();
          response.cookies.set("authenticated", "false", {
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
          if (userAuthData.role === "ADMIN") {
            return NextResponse.redirect(
              new URL(managementLoginPath, request.url),
            );
          } else
            return NextResponse.redirect(new URL(clientLoginPath, request.url));
        }
      } else if (isLoginPath) {
        // isValid mà còn ở trang đăng nhập thì chuyển hướng đến dashboard
        const value = request.cookies.get("authenticated") || "";
        if (value) {
          if (value.value === "true") {
            return NextResponse.redirect(
              new URL("/management/dashboard", request.url),
            );
          }
        }
      } else if (isClientLoginPath) {
        const value = request.cookies.get("authenticated") || "";
        if (value) {
          if (value.value === "true") {
            return NextResponse.redirect(new URL("/", request.url));
          }
        }
      }
    } else {
      const { error } = response;
      console.error("Error:", error);
      const nextResponse = NextResponse.next();
      nextResponse.cookies.set("authenticated", "false", {
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return NextResponse.redirect(new URL(clientLoginPath, request.url));
    }
  }

  // Cho phép truy cập vào các trang không được bảo vệ và trang đăng nhập nếu chưa xác thực
  return NextResponse.next();
}
