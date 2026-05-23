import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type ScreenCardProps = {
  href: string
  title: string
  description: string
  tags: string[]
  tone?: "sun" | "sand" | "rose"
}

const toneClasses: Record<NonNullable<ScreenCardProps["tone"]>, string> = {
  sun: "bg-[linear-gradient(135deg,#fff4d8_0%,#fdecc0_55%,#fff7e6_100%)]",
  sand: "bg-[linear-gradient(135deg,#f4efe9_0%,#f8f1e8_55%,#fff_100%)]",
  rose: "bg-[linear-gradient(135deg,#ffe4ea_0%,#ffd2de_55%,#fff_100%)]",
}

export function ScreenCard({ href, title, description, tags, tone = "sand" }: ScreenCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
