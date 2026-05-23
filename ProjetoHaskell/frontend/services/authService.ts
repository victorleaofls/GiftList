import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/auth"

const mockUser: AuthUser = {
  id: "USR-001",
  name: "Ana Silva",
  email: "ana@presentea.com",
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function login(payload: LoginPayload): Promise<AuthUser> {
  await wait(250)

  if (!payload.email || payload.password.length < 6) {
    throw new Error("Invalid credentials")
  }

  return { ...mockUser, email: payload.email }
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  await wait(300)

  if (!payload.firstName || !payload.lastName || payload.password.length < 6) {
    throw new Error("Invalid registration")
  }

  return {
    ...mockUser,
    name: `${payload.firstName} ${payload.lastName}`,
    email: payload.email,
  }
}
