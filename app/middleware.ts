import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log("cac", request.cookies);

  return undefined;
}

export const config = {
  matcher: "/*",
};
