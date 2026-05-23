import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { MyListSummary } from "@/hooks/useMyLists"

const formatDate = (value: string) => {
  if (!value) return ""
  const [year, month, day] = value.split("-")
  return `${day}/${month}/${year}`
}

type MyListCardProps = {
  list: MyListSummary
  onDelete: (list: MyListSummary) => void
}

export function MyListCard({ list, onDelete }: MyListCardProps) {
  const progress = list.total > 0 ? Math.round((list.raised / list.total) * 100) : 0

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex h-32 items-center justify-center bg-muted text-xl font-semibold text-muted-foreground">
        {list.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
      <CardContent className="space-y-2 pt-4">
        <h3 className="text-base font-semibold">{list.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{list.desc}</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {list.createdAt ? <span>Criada em {formatDate(list.createdAt)}</span> : null}
          <span>{list.itemsCount} itens</span>
          <span>{progress}% arrecadado</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild variant="secondary" size="sm" className="flex-1">
          <Link href={`/edit-list?id=${list.id}`}>Editar</Link>
        </Button>
        <Button asChild variant="secondary" size="sm" className="flex-1">
          <Link href={`/view-list?id=${list.id}`}>Ver</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive"
          onClick={() => onDelete(list)}
        >
          Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}
