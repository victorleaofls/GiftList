import Link from "next/link"
import { Copy, QrCode } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { PublicListSummary } from "@/hooks/useLists"

type PublicListCardProps = {
  list: PublicListSummary
  onCopyLink: (list: PublicListSummary) => void
  onShowQr: (list: PublicListSummary) => void
}

export function PublicListCard({ list, onCopyLink, onShowQr }: PublicListCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="flex h-36 items-center justify-center bg-muted text-2xl font-semibold text-muted-foreground">
        {list.owner
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
      <CardContent className="space-y-2 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold">{list.name}</h3>
          {list.pixEligible ? <Badge variant="success">Pix</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">por {list.owner}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{list.desc}</p>
        <p className="text-xs text-muted-foreground">
          {list.itemsCount} presentes
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => onCopyLink(list)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => onShowQr(list)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild size="sm">
          <Link href={`/view-list?id=${list.id}`}>Ver lista</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
