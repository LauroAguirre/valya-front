import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { KpiData } from '@/lib/types'
import { cn } from '@/lib/utils'

export function KpiCard({ data }: { data: KpiData }) {
  const isPositive = (data.change ?? 0) >= 0

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-card-foreground text-2xl font-bold">
          {data.value}
        </div>
        {data.change != null && (
          <div
            className={cn(
              'mt-1 flex items-center gap-1 text-xs',
              isPositive ? 'text-primary' : 'text-destructive',
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {data.change}%
            </span>
            <span className="text-muted-foreground">{data.changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
