import type { GiftList } from "@/types/list"

const lists: GiftList[] = [
  {
    id: "PRE-001",
    name: "Casamento Ana & Lucas",
    owner: "Ana Silva",
    desc:
      "Nossa lista de presentes para o grande dia. Cada contribuicao nos ajuda a construir nosso lar.",
    date: "2026-08-15",
    createdAt: "2026-04-10",
    pixEligible: true,
    items: [
      {
        id: "ITEM-001",
        name: "Jogo de Panelas Tramontina",
        price: 499.9,
        raised: 350,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_830593-MLA101346321113_122025-F.webp",
      },
      {
        id: "ITEM-002",
        name: "Liquidificador Oster",
        price: 189.9,
        raised: 189.9,
        image: null,
      },
      {
        id: "ITEM-003",
        name: "Jogo de Cama Queen Size",
        price: 299.9,
        raised: 100,
        image: null,
      },
      {
        id: "ITEM-004",
        name: "Batedeira KitchenAid",
        price: 2499.9,
        raised: 800,
        image: null,
      },
      {
        id: "ITEM-005",
        name: "Cafeteira Nespresso",
        price: 599.9,
        raised: 0,
        image: null,
      },
    ],
  },
  {
    id: "PRE-002",
    name: "Cha de Bebe - Helena",
    owner: "Carla Mendes",
    desc: "Presentes para a chegada da Helena. Todo carinho e bem-vindo!",
    date: "2026-09-20",
    createdAt: "2026-04-28",
    pixEligible: true,
    items: [
      {
        id: "ITEM-006",
        name: "Carrinho de Bebe",
        price: 899.9,
        raised: 300,
        image: null,
      },
      {
        id: "ITEM-007",
        name: "Berco Portatil",
        price: 549.9,
        raised: 200,
        image: null,
      },
      {
        id: "ITEM-008",
        name: "Kit Mamadeiras",
        price: 149.9,
        raised: 149.9,
        image: null,
      },
    ],
  },
  {
    id: "PRE-003",
    name: "Casa Nova - Felipe & Julia",
    owner: "Felipe Costa",
    desc: "Ajuda com os moveis e eletrodomesticos da nossa primeira casa.",
    date: "2026-07-03",
    createdAt: "2026-05-02",
    pixEligible: true,
    items: [
      {
        id: "ITEM-009",
        name: "Sofa 3 lugares",
        price: 2699.9,
        raised: 1500,
        image: null,
      },
      {
        id: "ITEM-010",
        name: "Air fryer",
        price: 499.9,
        raised: 200,
        image: null,
      },
      {
        id: "ITEM-011",
        name: "Jogo de Toalhas",
        price: 129.9,
        raised: 50,
        image: null,
      },
    ],
  },
  {
    id: "PRE-004",
    name: "Cha de Panela - Mariana",
    owner: "Mariana Oliveira",
    desc: "Panelas, utensilios e tudo para a nova cozinha.",
    date: "2026-06-12",
    createdAt: "2026-03-25",
    pixEligible: false,
    items: [
      {
        id: "ITEM-012",
        name: "Jogo de Panelas",
        price: 399.9,
        raised: 0,
        image: null,
      },
      {
        id: "ITEM-013",
        name: "Conjunto de Facas",
        price: 189.9,
        raised: 0,
        image: null,
      },
    ],
  },
  {
    id: "PRE-005",
    name: "Formatura - Pedro Santos",
    owner: "Pedro Santos",
    desc: "Comemore comigo essa conquista! Contribua com qualquer valor.",
    date: "2026-11-05",
    createdAt: "2026-05-18",
    pixEligible: true,
    items: [
      {
        id: "ITEM-014",
        name: "Notebook para estudos",
        price: 3899.9,
        raised: 1200,
        image: null,
      },
      {
        id: "ITEM-015",
        name: "Curso de idiomas",
        price: 999.9,
        raised: 400,
        image: null,
      },
    ],
  },
  {
    id: "PRE-006",
    name: "Reveillon dos Sonhos",
    owner: "Luiza Rocha",
    desc: "Vamos celebrar juntos! Lista de presentes para a festa de Ano Novo.",
    date: "2026-12-31",
    createdAt: "2026-05-20",
    pixEligible: true,
    items: [
      {
        id: "ITEM-016",
        name: "Decoracao",
        price: 499.9,
        raised: 120,
        image: null,
      },
      {
        id: "ITEM-017",
        name: "Som para festa",
        price: 1899.9,
        raised: 450,
        image: null,
      },
    ],
  },
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getPublicLists(query?: string): Promise<GiftList[]> {
  await wait(200)

  if (!query) {
    return lists
  }

  const q = query.toLowerCase()
  return lists.filter(
    (list) =>
      list.name.toLowerCase().includes(q) ||
      list.owner.toLowerCase().includes(q) ||
      list.id.toLowerCase().includes(q)
  )
}

export async function getMyLists(): Promise<GiftList[]> {
  await wait(180)
  return lists.filter((list) => ["PRE-001", "PRE-003"].includes(list.id))
}

export async function getListById(id: string): Promise<GiftList | null> {
  await wait(180)
  return lists.find((list) => list.id === id) ?? null
}

export async function createList(payload: GiftList): Promise<GiftList> {
  await wait(250)
  return { ...payload, id: `PRE-${Math.floor(Math.random() * 900 + 100)}` }
}

export async function updateList(payload: GiftList): Promise<GiftList> {
  await wait(250)
  return payload
}

export async function deleteList(id: string): Promise<void> {
  await wait(200)
  const index = lists.findIndex((list) => list.id === id)
  if (index >= 0) {
    lists.splice(index, 1)
  }
}
