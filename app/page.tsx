import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, FileText, Users } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/sections/Navbar"
import Hero from "@/components/sections/Hero"
import LogoCarousel from "@/components/LogoCarousel"
import Integration from "@/components/sections/Integration"

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <LogoCarousel />
      <Integration />
      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your business
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Streamline your invoicing process with our comprehensive suite of tools
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.name} className="p-6">
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <h3 className="text-lg font-semibold">{feature.name}</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

const features = [
  {
    name: "Invoice Management",
    description: "Create and manage professional invoices with customizable templates.",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    name: "Client Management",
    description: "Keep track of your clients and their payment history in one place.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    name: "Analytics & Reports",
    description: "Get insights into your business with detailed financial reports.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
]