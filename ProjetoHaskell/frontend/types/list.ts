export type GiftItem = {
  id: string
  name: string
  price: number
  raised: number
  image?: string | null
}

export type GiftList = {
  id: string
  name: string
  owner: string
  desc: string
  date?: string | null
  createdAt?: string
  pixEligible?: boolean
  items: GiftItem[]
}
