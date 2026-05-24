import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GiftItem } from "@/types/list"
import Image from "next/image"

const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

type ProductCardProps = {
  item: GiftItem
  onContribute: (item: GiftItem) => void
}

export function ProductCard({ item, onContribute }: ProductCardProps) {
  const progress = item.price > 0 ? Math.min(100, Math.round((item.raised / item.price) * 100)) : 0
  const remaining = Math.max(0, item.price - item.raised)

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex h-46 items-center justify-center bg-muted text-base font-semibold text-muted-foreground overflow-hidden">
        {item.image ? (
          
            <Image 
              src={item.image}
              alt={item.name}
              width={400}
              height={200}
              className="aspect-video"
            />
          ):(
            <p>
              {item.name.charAt(0)}
            </p>)}
      </div>
      <CardContent className="space-y-3 pt-4">
        <div>
          <p className="text-base font-semibold">{item.name}</p>
          <p className="text-lg font-semibold text-foreground">{formatMoney(item.price)}</p>
        </div>
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatMoney(item.raised)}</span>
            <span>{progress}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Faltam {formatMoney(remaining)}
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">
          {progress >= 100 ? "Presenteado" : "Disponivel"}
        </span>
        {progress < 100 ? (
          <Button size="sm" onClick={() => onContribute(item)}>
            Contribuir via Pix
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
