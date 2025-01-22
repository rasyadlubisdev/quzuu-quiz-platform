import { NextResponse } from "next/server"

export default function middleware(req: Request) {
  const url = new URL(req.url)

  if (url.pathname === "/internal-error") {
    return NextResponse.rewrite(new URL("/505", req.url))
  }

  return NextResponse.next()
}
