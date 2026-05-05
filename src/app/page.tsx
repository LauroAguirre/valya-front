import { SiteFooter } from '@/components/landing/site-footer'
import { PricingSection } from '@/components/landing/pricing-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HeroSection } from '@/components/landing/hero-section'
import { SiteHeader } from '@/components/landing/site-header'

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <SiteFooter />
    </div>
  )
}
