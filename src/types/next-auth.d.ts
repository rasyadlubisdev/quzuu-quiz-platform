// src/types/next-auth.d.ts
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    backendToken?: string
    accountData?: any
  }

  interface User {
    backendToken?: string
    accountData?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string
    accountData?: any
  }
}