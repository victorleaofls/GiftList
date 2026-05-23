import { Card, CardContent } from "@/components/ui/card"

type FeatureCardProps = {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col items-center gap-3 pt-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
