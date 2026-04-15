// Root page - serves as landing page
// The (landing) route group handles layout (Navbar etc.)
// This file conflicts with app/(landing)/page.tsx so we just render the landing content

import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { PricingSection } from '@/components/landing/pricing-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { StatsSection } from '@/components/landing/stats-section'
import { Footer } from '@/components/landing/footer'
import { Navbar } from '@/components/layout/navbar'
import { auth } from '@/lib/auth'

export default async function RootPage() {
  const session = await auth()
  return (
    <div className="bg-[#0a0f1e] text-white overflow-hidden">
      <Navbar user={session?.user} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  )
}
