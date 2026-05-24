export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
}
