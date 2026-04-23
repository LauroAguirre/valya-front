import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { plans } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function Pricing() {
  return (
    <section id="planos" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Planos para cada momento
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">
            Comece com o trial gratuito e escolha o plano ideal para o seu
            negócio.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={cn(
                'border-border bg-card relative flex flex-col',
                plan.isPopular && 'border-primary',
              )}
            >
              {plan.isPopular && (
                <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-medium">
                  Mais popular
                </div>
              )}
              <CardHeader className="flex-1">
                <CardTitle className="text-card-foreground text-lg">
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <span className="text-foreground text-3xl font-bold">
                    R$ {plan.price}
                  </span>
                  <span className="text-muted-foreground">/mes</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map(feature => (
                    <li
                      key={feature}
                      className="text-muted-foreground flex items-start gap-3 text-sm"
                    >
                      <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={cn(
                    'w-full',
                    plan.isPopular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  )}
                  asChild
                >
                  <Link href="/registro">Começar agora</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
