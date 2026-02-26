import { LandingHeader } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Benefits } from "@/components/landing/benefits"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <LandingHeader />
      <main>
        <Hero />
        <Benefits />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
