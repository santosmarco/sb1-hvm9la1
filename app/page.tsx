import { Button } from "@/components/ui/button"
import { ArrowRight, Webhook, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Webhook className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Debug Webhooks with Ease
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Generate unique URLs, inspect payloads, and debug your webhook integrations in real-time.
        </p>
        <div className="flex space-x-4">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Real-time Monitoring</h2>
          <p className="text-muted-foreground">
            Watch requests come in as they happen. No refreshing needed.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Secure by Default</h2>
          <p className="text-muted-foreground">
            Every webhook endpoint is protected and data is encrypted.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Webhook className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Powerful Inspection</h2>
          <p className="text-muted-foreground">
            Analyze headers, query params, and payload data with ease.
          </p>
        </div>
      </div>
    </div>
  )
}