// Authentication middleware - temporarily disabled
// Will be re-enabled after login issues are resolved

import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
