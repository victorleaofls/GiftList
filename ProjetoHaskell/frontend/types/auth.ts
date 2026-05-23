export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
}
